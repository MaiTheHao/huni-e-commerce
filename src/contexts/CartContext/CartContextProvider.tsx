'use client';
import React, { useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import CartContext from './CartContext';
import { ICartItem } from '../../interfaces';
import { IProduct } from '@/interfaces';
import { loggerService } from '@/services/logger.service';

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
			loggerService.error('Lỗi khi lấy giỏ hàng:', error);
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
			try {
				await fetch(`/api/v1/cart?productId=${productId}`, { method: 'DELETE', cache: 'no-store' });
				await fetchCart();
			} catch (error) {
				loggerService.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
			} finally {
				setLoading(false);
			}
		},
		[fetchCart]
	);

	const handleRemoveAll = useCallback(async () => {
		setLoading(true);
		try {
			await fetch('/api/v1/cart', { method: 'DELETE', cache: 'no-store' });
			setItems([]);
			setProducts({});
		} catch (error) {
			loggerService.error('Lỗi khi xóa tất cả sản phẩm khỏi giỏ hàng:', error);
		} finally {
			setLoading(false);
		}
	}, [fetchCart]);

	const handleQuantity = useCallback(
		async (productId: string, quantity: number) => {
			if (quantity < MIN_ITEM_QUANTITY || quantity > MAX_ITEM_QUANTITY) return;
			try {
				setItems((items) => items.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
				await fetch('/api/v1/cart', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ productId, quantity }),
					cache: 'no-store',
				});
				await fetchCart();
			} catch (error) {
				loggerService.error('Lỗi khi cập nhật số lượng sản phẩm:', error);
			}
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
					cache: 'no-store',
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
			handleRemoveAll,
			handleQuantity,
			handleAddToCart,
			setItems,
			setProducts,
		}),
		[items, products, loading, fetchCart, handleRemove, handleRemoveAll, handleQuantity, handleAddToCart, setItems, setProducts]
	);

	return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export default React.memo(CartContextProvider);
