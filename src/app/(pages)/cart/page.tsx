'use client';
import AppBody from '@/components/app-body/AppBody';
import styles from './Cart.module.scss';
import React, { useEffect, useState } from 'react';
import tax from '@/data/tax.json';
import CartItemsTable from './CartItemsTable';
import CartPriceTable from './CartPriceTable';
import { ICartItem, IProduct } from '@/interfaces';

const VAT = parseInt(tax.VAT, 10) / 100;
const MAX_ITEM_QUANTITY = 999;
const MIN_ITEM_QUANTITY = 1;

function CartPage() {
	const [items, setItems] = useState<ICartItem[]>([]);
	const [products, setProducts] = useState<Record<string, IProduct | null>>({});
	const [loading, setLoading] = useState(true);

	const fetchProducts = async (cartItems: ICartItem[]) => {
		const ids = cartItems.map((item) => item.productId);
		const uniqueIds = Array.from(new Set(ids));
		const fetches = uniqueIds.map(async (id) => {
			try {
				const res = await fetch(`/api/v1/product/${id}`);
				if (!res.ok) return [id, null];
				const data = await res.json();
				return [id, data.data as IProduct];
			} catch {
				return [id, null];
			}
		});
		const results = await Promise.all(fetches);
		setProducts(Object.fromEntries(results));
	};

	const fetchCart = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/v1/cart', {
				credentials: 'include',
			});
			const data = (await res.json()).data;
			const cartItems = data.cart.items || [];
			setItems(cartItems);
			if (cartItems.length > 0) {
				await fetchProducts(cartItems);
			} else {
				setProducts({});
			}
		} catch {
			setItems([]);
			setProducts({});
		}
		setLoading(false);
	};

	const handleRemove = async (productId: string) => {
		setLoading(true);
		await fetch(`/api/v1/cart?productId=${productId}`, { method: 'DELETE' });
		await fetchCart();
	};

	const handleQuantity = async (productId: string, quantity: number) => {
		if (quantity < MIN_ITEM_QUANTITY || quantity > MAX_ITEM_QUANTITY) return;
		setItems((items) => items.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
		await fetch('/api/v1/cart', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ productId, quantity }),
		});
		await fetchCart();
	};

	useEffect(() => {
		fetchCart();
	}, []);

	return (
		<AppBody>
			<div className={styles.cart}>
				<CartItemsTable
					items={items}
					products={products}
					loading={loading}
					onRemove={handleRemove}
					onQuantity={handleQuantity}
				/>
				<CartPriceTable items={items} products={products} vat={VAT} loading={loading} />
			</div>
		</AppBody>
	);
}

export default CartPage;
