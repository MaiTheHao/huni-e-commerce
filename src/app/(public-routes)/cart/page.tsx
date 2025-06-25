'use client';
import styles from './Cart.module.scss';
import React, { useContext } from 'react';
import tax from '@/data/tax.json';
import CartItemsTable from './CartItemsTable';
import CartPriceTable from './CartPriceTable';
import CartContext from '@/contexts/CartContext/CartContext';

const VAT = parseInt(tax.VAT, 10) / 100;

function CartPage() {
	const { items, products, loading, handleRemove, handleQuantity } = useContext(CartContext);

	return (
		<div className={styles.cart}>
			<CartItemsTable items={items} products={products} loading={loading} onRemove={handleRemove} onQuantity={handleQuantity} />
			<CartPriceTable items={items} products={products} vat={VAT} loading={loading} />
		</div>
	);
}

export default CartPage;
