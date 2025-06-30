'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../Profile.module.scss';
import { IOrder, ORDER_STATUS, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import { getUserOrders } from '../apis';
import { loggerService } from '@/services/logger.service';
import { isEmpty, toLocalePrice } from '@/util';
import Spinner from '@/components/ui/spinner/Spinner';
import clsx from 'clsx';
import Link from 'next/link';
import { ORDER_STATUS_TEXT_MAP } from '@/consts/map-value';
import OrderItem from './OrderProduct';
import { formatDateToVietnameseString } from '@/util/date';
import OrderStatus from '@/components/ui/order-status/OrderStatus';

export default function OrdersPage() {
	const cacheRef = useRef<{ [key in TOrderStatus | 'all']?: IOrder[] }>({});
	const [status, setStatus] = useState<TOrderStatus | 'all'>('all');
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchOrders = async (fetchStatus: TOrderStatus | 'all', force: boolean = false): Promise<IOrder[]> => {
		if (cacheRef.current[fetchStatus] && !force) {
			setLoading(false);
			return cacheRef.current[fetchStatus]!;
		}

		setLoading(true);
		try {
			const [error, data] = await getUserOrders(fetchStatus === 'all' ? undefined : fetchStatus);

			if (error) {
				loggerService.error('Lỗi khi lấy danh sách đơn hàng:', error);
				setLoading(false);
				return [];
			}

			if (isEmpty(data)) {
				loggerService.warning('Dữ liệu đơn hàng rỗng:', fetchStatus);
				setLoading(false);
				return [];
			}

			cacheRef.current[fetchStatus] = data!;
			setLoading(false);
			return data!;
		} catch (err) {
			loggerService.error('Lỗi không xác định khi lấy đơn hàng:', err);
			setLoading(false);
			return [];
		}
	};

	useEffect(() => {
		let isMounted = true;

		const initializeOrders = async () => {
			const data = await fetchOrders('all');

			if (!isMounted || isEmpty(data)) {
				return;
			}

			const statuses: TOrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled', 'confirmed'];

			statuses.forEach((s) => {
				if (!cacheRef.current[s]) {
					cacheRef.current[s] = [];
				}
				cacheRef.current[s] = data.filter((order) => order.status === s);
			});

			cacheRef.current['all'] = data;

			if (isMounted) {
				setOrders(data);
			}
		};

		initializeOrders();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleStatusChange = useCallback(async (newStatus: TOrderStatus | 'all', forceFetch: boolean = false) => {
		const data = await fetchOrders(newStatus, forceFetch);
		setOrders(data);
		setStatus(newStatus);
	}, []);

	const isActivated = useCallback((curStatus: TOrderStatus | 'all') => curStatus === status, [status]);

	return (
		<div className={styles.part}>
			<div className={styles.part__title}>Đơn hàng của tôi</div>
			<div className={styles['orders']}>
				<ul className={styles['orders-nav']}>
					<li onClick={() => handleStatusChange('all')} className={clsx(styles['orders-nav__item'], isActivated('all') ? styles['active'] : '')}>
						Tất cả
					</li>
					{ORDER_STATUS.map((s) => (
						<li key={`order-nav--${s}`} onClick={() => handleStatusChange(s)} className={clsx(styles['orders-nav__item'], isActivated(s) ? styles['active'] : '')}>
							{ORDER_STATUS_TEXT_MAP[s]}
						</li>
					))}
				</ul>
				<ul className={styles['orders-list']}>
					{loading ? (
						<p className={styles['part__loading-state']}>
							<Spinner /> Đang tải đơn hàng...
						</p>
					) : orders.length === 0 ? (
						<p className={styles['part__empty-state']}>Chưa có đơn hàng nào.</p>
					) : (
						orders.map((order) => {
							return (
								<Link key={order._id} href={`/profile/orders/${order._id}`} prefetch={false}>
									<li className={clsx(styles['orders-item'], styles['modern-card'])}>
										<div className={styles['orders-item__header']}>
											<span className={styles.date}>{formatDateToVietnameseString(order.createdAt)}</span>
											<OrderStatus status={order.status} className={styles[`status--${order.status}`]} />
										</div>
										<ul className={styles['order-products']}>
											{order.items.map((item, idx) => {
												if (idx >= 3) return null;
												return <OrderItem key={item.productId} item={item} />;
											})}
											{order.items.length > 3 && <div className={styles['order-products__more']}>+ {order.items.length - 3} sản phẩm khác</div>}
										</ul>
										<div className={styles['orders-item__price']}>
											<span className={styles['orders-item__price__label']}>Tổng:</span>
											<span className={styles['orders-item__price__value']}>{toLocalePrice(order.totalPrice)}</span>
										</div>
									</li>
								</Link>
							);
						})
					)}
				</ul>
			</div>
		</div>
	);
}
