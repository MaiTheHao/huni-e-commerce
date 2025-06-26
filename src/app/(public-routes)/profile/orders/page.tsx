'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../Profile.module.scss';
import { IOrder, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import { getUserOrders } from '../apis';
import { loggerService } from '@/services/logger.service';
import { isEmpty } from '@/util';
import Spinner from '@/components/ui/spinner/Spinner';
import clsx from 'clsx';
import Image from 'next/image';
import { getOrderStatusText } from '@/util/enum-to-text.util';

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

			const statuses: TOrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled'];

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
					<li onClick={() => handleStatusChange('pending')} className={clsx(styles['orders-nav__item'], isActivated('pending') ? styles['active'] : '')}>
						Chờ xác nhận
					</li>
					<li onClick={() => handleStatusChange('shipped')} className={clsx(styles['orders-nav__item'], isActivated('shipped') ? styles['active'] : '')}>
						Đang giao
					</li>
					<li onClick={() => handleStatusChange('delivered')} className={clsx(styles['orders-nav__item'], isActivated('delivered') ? styles['active'] : '')}>
						Đã giao
					</li>
					<li onClick={() => handleStatusChange('cancelled')} className={clsx(styles['orders-nav__item'], isActivated('cancelled') ? styles['active'] : '')}>
						Đã hủy
					</li>
				</ul>
				<ul className={styles['orders-list']}>
					{loading ? (
						<p className={styles['part__loading-state']}>
							<Spinner /> Đang tải đơn hàng...
						</p>
					) : orders.length === 0 ? (
						<p className={styles['part__empty-state']}>Chưa có đơn hàng nào.</p>
					) : (
						orders.map((order) => (
							<li key={order._id} className={clsx(styles['orders-list__item'], styles['modern-card'])}>
								<div className={styles['orders-list__header']}>
									<span className={styles['orders-list__date']}>
										{new Date(order.createdAt).toLocaleString('vi-VN', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
											hour12: false,
										})}
									</span>
									<span className={clsx(styles['orders-list__status'], styles[`status--${order.status}`])}>{getOrderStatusText(order.status)}</span>
								</div>
								<div className={styles['orders-list__products']}>
									{order.items.map((item) => (
										<div key={item.productId} className={styles['orders-list__product']}>
											<div className={styles['orders-list__product-image']}>
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
											<div className={styles['orders-list__product-info']}>
												<div className={styles['orders-list__product-name']}>{item.productName}</div>
												<div className={styles['orders-list__product-qty']}>
													Số lượng: <b>{item.quantity}</b>
												</div>
											</div>
										</div>
									))}
								</div>
								<div className={styles['orders-list__footer']}>
									<span className={styles['orders-list__total']}>
										<b>{order.totalPrice.toLocaleString()}₫</b>
									</span>
									<a className={'cta-button--primary'} href={`/profile/orders/${order._id}`}>
										Xem chi tiết &rarr;
									</a>
								</div>
							</li>
						))
					)}
				</ul>
			</div>
		</div>
	);
}
