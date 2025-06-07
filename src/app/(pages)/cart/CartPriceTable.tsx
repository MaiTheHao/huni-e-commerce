'use client';
import React from 'react';
import styles from './Cart.module.scss';
import clsx from 'clsx';
import { ICartItem, IProduct } from '@/interfaces';
import Table from '@/components/ui/table/Table';
import Link from 'next/link';

interface Props {
	items: ICartItem[];
	products: Record<string, IProduct | null>;
	loading: boolean;
	vat: number;
}

const CartPriceTable: React.FC<Props> = ({ items, products, vat, loading }) => {
	const total = items.reduce((sum, item) => {
		const product = products[item.productId];
		const price = product ? product.price : 0;
		return sum + price * item.quantity;
	}, 0);
	const vatAmount = total * vat;

	return (
		<Table
			sections={[
				{
					title: 'Tổng đơn giá',
					children: (
						<ul className={styles.priceSummaryList}>
							<li className={styles.priceSummaryItem}>
								<span className={styles.summaryTitle}>Tổng cộng</span>
								<span className={styles.summaryPrice}>
									{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
								</span>
							</li>
							<li className={styles.priceSummaryItem}>
								<span className={styles.summaryTitle}>VAT</span>
								<span className={styles.summaryPrice}>
									{vatAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
								</span>
							</li>
						</ul>
					),
				},
				// {
				// 	title: 'Mã giảm giá',
				// 	children: (
				// 		<div className={styles.discountSection}>
				// 			<input type='text' placeholder='Nhập mã của bạn...' />
				// 			<button>
				// 				<span>&gt;</span>
				// 			</button>
				// 		</div>
				// 	),
				// },
			]}
			footer={
				<Link href='/checkout' className={clsx('cta-button')}>
					Thanh toán ngay
				</Link>
			}
			loading={loading}
			className={styles.priceTable}
		/>
	);
};

export default CartPriceTable;
