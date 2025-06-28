'use client';
import { memo } from 'react';
import Image from 'next/image';
import styles from '../Profile.module.scss';
import { IOrderItem } from '@/interfaces/entity/order/order.entity';
import { toLocalePrice } from '@/util';
import Link from 'next/link';

function OrderItem({ item, redirectable }: { item: IOrderItem; redirectable?: boolean }) {
	const OrderItemBody = (
		<>
			<div className={styles['order-product-image']}>
				<Image
					src={item.productImage}
					alt={item.productName}
					width={80}
					height={80}
					style={{
						objectFit: 'cover',
						aspectRatio: '1 / 1',
					}}
					sizes='(max-width: 768px) 80px, 80px'
				/>
			</div>
			<div className={styles['order-product-info']}>
				<div className={styles['order-product-info__name']}>{item.productName}</div>
				<div className={styles['order-product-info__price']}>
					<b>{toLocalePrice(item.unitPrice)}</b> x <b>{item.quantity}</b>
				</div>
			</div>
		</>
	);

	if (!redirectable) {
		return (
			<div className={styles['order-product']} key={item.productId}>
				{OrderItemBody}
			</div>
		);
	}

	if (redirectable) {
		return (
			<Link key={item.productId} className={styles['order-product']} href={`/${item.productCategory}/${item.productId}`} prefetch={false}>
				{OrderItemBody}
			</Link>
		);
	}
}

export default memo(OrderItem, (prevProps, nextProps) => prevProps.item.productId === nextProps.item.productId);
