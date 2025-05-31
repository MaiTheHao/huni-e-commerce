'use client';
import React from 'react';
import styles from './Cart.module.scss';
import clsx from 'clsx';
import { ICartItem } from '@/entities';
import Table from '@/components/table/Table';
import Link from 'next/link';

interface CartPriceTableProps {
	items: ICartItem[];
	loading: boolean;
	vat: number;
}

const CartPriceTable: React.FC<CartPriceTableProps> = ({ items, vat, loading }) => {
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const vatAmount = total * vat;

	const priceSummaryContent = (
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
	);

	const discountContent = (
		<div className={styles.discountSection}>
			<input type='text' placeholder='Nhập mã của bạn...' />
			<button>
				<span>&gt;</span>
			</button>
		</div>
	);

	const sections = [
		{
			title: 'Tổng đơn giá',
			children: priceSummaryContent,
		},
		{
			title: 'Mã giảm giá',
			children: discountContent,
		},
	];

	const footer = (
		<Link href='/checkout' className={clsx('cta-button')}>
			Thanh toán ngay
		</Link>
	);

	return <Table sections={sections} footer={footer} loading={loading} className={styles.priceTable} />;
};

export default CartPriceTable;
