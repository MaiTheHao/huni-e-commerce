'use client';
import styles from './Cart.module.scss';
import React from 'react';

import CartItemsTable from './CartItemsTable';
import CartPriceTable from './CartPriceTable';

function CartPage() {
	return (
		<div className={styles.cart}>
			<CartItemsTable />
			<CartPriceTable />
		</div>
	);
}

export default CartPage;
