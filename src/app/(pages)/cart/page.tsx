'use client';
import AppBody from '@/components/app-body/AppBody';
import styles from './Cart.module.scss';
import React, { useContext } from 'react';
import tax from '@/data/tax.json';
import CartItemsTable from './CartItemsTable';
import CartPriceTable from './CartPriceTable';
import CartContext from '@/contexts/CartContext/CartContext';

const VAT = parseInt(tax.VAT, 10) / 100;

function page() {
	const { items, products, loading, handleRemove, handleQuantity } = useContext(CartContext);

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

export default page;
