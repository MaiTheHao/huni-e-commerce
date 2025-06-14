'use client';
import React, { useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import CartContext from './CartContext';
import { ICartItem } from '../../interfaces';
import { IProduct } from '@/interfaces';

interface CartContextProviderProps {
	children: ReactNode;
}

const MAX_ITEM_QUANTITY = 999;
const MIN_ITEM_QUANTITY = 1;

function isItemsEqual(a: ICartItem[], b: ICartItem[]) {
	if (a.length !== b.length) return false;
	return a.every((item, index) => item.productId === b[index].productId && item.quantity === b[index].quantity);
}

function CartContextProvider({ children }: CartContextProviderProps) {
	const [items, setItems] = useState<ICartItem[]>([]);
	const [products, setProducts] = useState<Record<string, IProduct | null>>({});
	const [loading, setLoading] = useState(false);

	const fetchProducts = useCallback(async (cartItems: ICartItem[]) => {
		const ids = Array.from(new Set(cartItems.map((item) => item.productId)));
		if (ids.length === 0) {
			setProducts({});
			return;
		}
		try {
			const res = await fetch('/api/v1/product/batch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ids }),
			});
			if (!res.ok) {
				setProducts({});
				return;
			}
			const data = await res.json();
			const productsArray = data.data as IProduct[];
			const productsMap: Record<string, IProduct | null> = {};
			ids.forEach((id) => {
				const product = productsArray.find((p) => p && p._id === id) || null;
				productsMap[id] = product;
			});
			setProducts(productsMap);
		} catch {
			setProducts({});
		}
	}, []);

	const fetchCart = useCallback(async () => {
		setLoading(true);
		let cartItems: ICartItem[] = [];
		try {
			const res = await fetch('/api/v1/cart', {
				credentials: 'include',
			});
			const data = (await res.json()).data;
			cartItems = data.cart.items || [];
		} catch (error) {
			console.error('Error fetching cart:', error);
		} finally {
			setLoading(false);
			setItems((prevItems) => {
				if (!isItemsEqual(cartItems, prevItems)) {
					if (cartItems.length > 0) {
						fetchProducts(cartItems);
					} else {
						setProducts({});
					}
					return cartItems;
				}
				return prevItems;
			});
		}
	}, [fetchProducts]);

	const handleRemove = useCallback(
		async (productId: string) => {
			setLoading(true);
			await fetch(`/api/v1/cart?productId=${productId}`, { method: 'DELETE' });
			await fetchCart();
			setLoading(false);
		},
		[fetchCart]
	);

	const handleQuantity = useCallback(
		async (productId: string, quantity: number) => {
			if (quantity < MIN_ITEM_QUANTITY || quantity > MAX_ITEM_QUANTITY) return;
			setItems((items) => items.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
			await fetch('/api/v1/cart', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId, quantity }),
			});
			await fetchCart();
		},
		[fetchCart]
	);

	const handleAddToCart = useCallback(
		async (_id: string, quantity?: number) => {
			try {
				const res = await fetch('/api/v1/cart', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ productId: _id, quantity: quantity || 1 }),
				});
				if (!res.ok) {
					throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
				}
				await fetchCart();
			} catch (error) {
				console.error(error);
			}
		},
		[fetchCart]
	);

	useEffect(() => {
		fetchCart();
	}, []);

	const contextValue = useMemo(
		() => ({
			items,
			products,
			loading,
			fetchCart,
			handleRemove,
			handleQuantity,
			handleAddToCart,
			setItems,
			setProducts,
		}),
		[items, products, loading, fetchCart, handleRemove, handleQuantity, handleAddToCart, setItems, setProducts]
	);

	return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export default React.memo(CartContextProvider);
