'use client';
import AppBody from '@/components/app-body/AppBody';
import styles from './Cart.module.scss';
import React, { useEffect, useState } from 'react';
import tax from '@/data/tax.json';

type Props = {};
const VAT: number = parseInt(tax.VAT, 10) / 100;
let isInitCart = false;
const MAX_ITEM_QUANTITY = 10;
const MIN_ITEM_QUANTITY = 1;
const CART_UPDATE_DEBOUNCE = 700;

function CartPage({}: Props) {
	// const [cart, setCart] = useState<ICart | null>(null);
	// const [products, setProducts] = useState<Product[]>([]);
	// const [loading, setLoading] = useState(true);

	// const handleInitCart = async () => {
	// 	try {
	// 		setLoading(true);

	// 		// Lấy cart
	// 		const cartData: ICart = await getCart();
	// 		setCart(cartData);

	// 		// Promise all
	// 		const productPromises = cartData.items.map(async (cartItem) => {
	// 			const res = await getProductById(cartItem.productId);
	// 			if (!res.data) {
	// 				console.warn(`Product with ID ${cartItem.productId} not found`);
	// 				return null;
	// 			}
	// 			return res.data as Product;
	// 		});

	// 		const products = await Promise.all(productPromises);
	// 		const validProducts = products.filter((product): product is Product => product !== null);
	// 		setProducts(validProducts);
	// 	} catch (err) {
	// 		console.error('Cart fetch error:', err);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const handleRemoveItem = async (productId: string) => {
	// 	if (!cart) return;
	// 	await removeFromCart(productId);
	// 	await handleInitCart();
	// };

	// const handleQuantity = async (productId: string, newQuantity: number) => {
	// 	if (!cart) return;
	// 	const updatedItems = cart.items.map((item) =>
	// 		item.productId === productId ? { ...item, quantity: newQuantity } : item
	// 	);
	// 	setCart({ ...cart, items: updatedItems });
	// };

	// // Lấy cart và các sản phẩm trong cart
	// useEffect(() => {
	// 	isInitCart = true;
	// 	handleInitCart();
	// }, []);

	// // Debounce update cart data
	// useEffect(() => {
	// 	if (!cart) return;
	// 	if (isInitCart) {
	// 		isInitCart = false;
	// 		return;
	// 	}

	// 	if (loading) return;

	// 	const updateCartData = async () => {
	// 		try {
	// 			setLoading(true);
	// 			await Promise.all(cart.items.map((item) => updateCartItem(item.productId, item.price, item.quantity)));
	// 		} catch (err) {
	// 			console.error('Failed to update cart:', err);
	// 		} finally {
	// 			handleInitCart();
	// 			setLoading(false);
	// 		}
	// 	};

	// 	const debounceTimeout = setTimeout(updateCartData, CART_UPDATE_DEBOUNCE);
	// 	return () => clearTimeout(debounceTimeout);
	// }, [cart]);

	return (
		<AppBody>
			{/* <div className={styles.cart}>
				<CartItemsTable
					items={products}
					cart={cart}
					loading={loading}
					onRemoveItem={handleRemoveItem}
					onQuantityChange={handleQuantity}
				/>

				<CartPriceTable items={cart?.items ?? []} vat={VAT} loading={loading} />
			</div> */}
			CART
		</AppBody>
	);
}

export default CartPage;
