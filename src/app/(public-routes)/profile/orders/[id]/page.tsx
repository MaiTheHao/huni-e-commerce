'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import styles from '../../Profile.module.scss';
import { IOrder, IOrderItem } from '@/interfaces/entity/order/order.entity';
import { toLocalePrice } from '@/util';
import Spinner from '@/components/ui/spinner/Spinner';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { getOrderDetail } from '../../apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { ORDER_STATUS_TEXT_MAP } from '@/consts/map-value';
import { ROUTES } from '@/consts/routes.setting';
import OrderItem from '../OrderProduct';
import { formatDateToVietnameseString } from '@/util/date';

const OrderDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const [order, setOrder] = useState<IOrder | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchOrderDetail = useCallback(async () => {
		if (!id) {
			setLoading(false);
			return;
		}
		setLoading(true);
		try {
			const [, orderData] = await getOrderDetail(id);
			setOrder(orderData);
		} catch (error) {
			console.error('Failed to fetch order details:', error);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		let mounted = true;
		if (mounted) fetchOrderDetail();
		return () => {
			mounted = false;
		};
	}, [fetchOrderDetail]);

	if (loading) {
		return (
			<div className={styles.part}>
				<p className={styles['part__loading-state']}>
					<Spinner /> Đang tải chi tiết đơn hàng...
				</p>
			</div>
		);
	}

	const isOrderValid = order && order.items.length > 0;
	if (!isOrderValid) {
		return (
			<div className={styles.part}>
				<p className={styles['part__empty-state']}>Không tìm thấy đơn hàng.</p>
			</div>
		);
	}

	return (
		<>
			<div className={styles['part']}>
				<div className={styles['order-detail']}>
					<header className={styles['order-detail__header']}>
						<span className={styles.date}>{formatDateToVietnameseString(order.createdAt)}</span>
						<span className={clsx(styles['order-detail__header__status'], styles[`status--${order.status}`])}>{ORDER_STATUS_TEXT_MAP[order.status]}</span>
					</header>
				</div>
			</div>
			<div className={styles['part']}>
				<p className={styles['part__title']}>Danh sách sản phẩm</p>
				<div className={styles['order-items']}>
					<ul className={clsx(styles['order-products'])}>
						{order.items.map((item: IOrderItem) => {
							return <OrderItem key={item.productId} item={item} redirectable />;
						})}
					</ul>
				</div>
			</div>

			<div className={styles['part']}>
				<p className={styles['part__title']}>Giá trị đơn hàng</p>
				<div className={styles['order-detail__price']}>
					<div className={styles['order-detail__price__row']}>
						<span className={styles['order-detail__price__label']}>Tạm tính:</span>
						<span>{toLocalePrice(order.subtotalPrice)}</span>
					</div>
					{order.vatAmount !== undefined && order.vatAmount > 0 && (
						<div className={styles['order-detail__price__row']}>
							<span className={styles['order-detail__price__label']}>Thuế (VAT):</span>
							<span>{toLocalePrice(order.vatAmount)}</span>
						</div>
					)}
					{order.discountAmount !== undefined && order.discountAmount > 0 && (
						<div className={styles['order-detail__price__row']}>
							<span className={styles['order-detail__price__label']}>Giảm giá:</span>
							<span>-{toLocalePrice(order.discountAmount)}</span>
						</div>
					)}
					{order.shippingFee !== undefined && order.shippingFee > 0 && (
						<div className={styles['order-detail__price__row']}>
							<span className={styles['order-detail__price__label']}>Phí vận chuyển:</span>
							<span>{toLocalePrice(order.shippingFee)}</span>
						</div>
					)}
					<div className={clsx(styles['order-detail__price__row'], styles['order-detail__price__total'])}>
						<span className={styles['order-detail__price__total__label']}>Tổng cộng:</span>
						<span className={styles['order-detail__price__total__value']}>{toLocalePrice(order.totalPrice)}</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrderDetailPage;
