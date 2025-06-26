'use client';
import React, { useMemo } from 'react';
import styles from './Cart.module.scss';
import clsx from 'clsx';
import Table from '@/components/ui/table/Table';
import tax from '@/data/tax.json';
import Link from 'next/link';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import { calcDiscountedPrice } from '@/util';

const VAT = parseInt(tax.VAT, 10) / 100;

const CartPriceTable: React.FC = () => {
	const { items, products, loading } = useCartContext();

	const submitable = items.length > 0;

	const subtotal = useMemo(() => {
		return items.reduce((sum, item) => {
			const product = products[item.productId];
			const price = product ? calcDiscountedPrice(product.price, product.discountPercent, true) : 0;
			return sum + price * item.quantity;
		}, 0);
	}, [items, products, submitable]);

	const vatAmount = subtotal * VAT;

	const total = subtotal + vatAmount;

	return (
		<Table
			sections={[
				{
					title: 'Tổng đơn giá',
					children: (
						<ul className={styles.priceSummaryList}>
							<li className={styles.priceSummaryItem}>
								<span className={styles.summaryTitle}>Tạm tính</span>
								<span className={styles.summaryPrice}>{subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
							</li>
							<li className={styles.priceSummaryItem}>
								<span className={styles.summaryTitle}>VAT</span>
								<span className={styles.summaryPrice}>{vatAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
							</li>
							<li className={styles.priceSummaryItem}>
								<span className={styles.summaryTitle}>Tổng cộng</span>
								<span className={styles.summaryPrice}>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
							</li>
						</ul>
					),
				},
			]}
			footer={
				<>
					<Link
						href={submitable ? '/checkout' : '#'}
						className={clsx('cta-button--primary', {
							disabled: !submitable,
						})}
						title={!submitable ? 'Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.' : undefined}
					>
						Đặt hàng ngay
					</Link>
				</>
			}
			loading={loading}
			className={styles.priceTable}
		/>
	);
};

export default CartPriceTable;
