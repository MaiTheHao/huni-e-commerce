'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import styles from '../../Profile.module.scss';
import { IOrder, IOrderItem } from '@/interfaces/entity/order/order.entity';
import { getOrderStatusText } from '@/util/enum-to-text.util';
import { toLocalePrice } from '@/util';
import Spinner from '@/components/ui/spinner/Spinner';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { getOrderDetail } from '../../apis';

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

	if (!order) {
		return (
			<div className={styles.part}>
				<p className={styles['part__empty-state']}>Không tìm thấy đơn hàng.</p>
				<Link href='/profile/orders' className='cta-button--primary' prefetch={false}>
					Quay lại danh sách đơn hàng
				</Link>
			</div>
		);
	}

	const formattedDate = new Date(order.createdAt).toLocaleString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});

	return (
		<div className={styles['part']}>
			<h2 className={styles['part__title']}>Chi tiết đơn hàng</h2>

			<div className={styles['order-detail']}>
				<header className={styles['order-detail__header']}>
					<div className={styles['order-detail__header__info']}>
						<span className={styles['order-detail__header__info__date']}>{formattedDate}</span>
						<span className={clsx(styles['order-detail__header__info__status'], styles[`status--${order.status}`])}>{getOrderStatusText(order.status)}</span>
					</div>
					<div className={styles['order-detail__header__meta']}>
						<div className={styles['order-detail__header__id']}>
							Mã đơn hàng: <b>{order._id}</b>
						</div>
					</div>
				</header>

				<article className={styles['order-detail__customer']}>
					<h2>Thông tin khách hàng</h2>
					<div className={styles['order-detail__customer__contact']}>
						<h3>Thông tin liên hệ</h3>
						<dl>
							<dt>Khách hàng:</dt>
							<dd>{order.customerName}</dd>
							<dt>Email:</dt>
							<dd>{order.customerEmail}</dd>
							<dt>Điện thoại:</dt>
							<dd>{order.customerPhone}</dd>
						</dl>
					</div>
					<div className={styles['order-detail__customer__delivery']}>
						<h3>Địa chỉ giao hàng</h3>
						<dl>
							<dt>Địa chỉ:</dt>
							<dd>{order.customerAddress}</dd>
							{order.additionalInfo && (
								<>
									<dt>Ghi chú:</dt>
									<dd>
										<details>
											<summary>Xem ghi chú</summary>
											<p>{order.additionalInfo}</p>
										</details>
									</dd>
								</>
							)}
						</dl>
					</div>
				</article>

				<section className={styles['order-detail__products']}>
					<h2>Sản phẩm</h2>
					<div className={styles['order-detail__products__header']}>
						<span>Tên sản phẩm</span>
						<span>Số lượng</span>
						<span>Đơn giá</span>
						<span>Giảm giá</span>
						<span>Tạm tính</span>
					</div>
					{order.items.map((item: IOrderItem) => (
						<article key={item.productId} className={styles['order-detail__product']}>
							<div className={styles['order-detail__product-image']}>
								<Image
									src={item.productImage}
									alt={item.productName}
									width={80}
									height={80}
									style={{ objectFit: 'cover', aspectRatio: '1 / 1' }}
									sizes='(max-width: 768px) 80px, 80px'
								/>
							</div>
							<div className={styles['order-detail__product-info']}>
								<div className={styles['order-detail__product-name']}>{item.productName}</div>
								<div className={styles['order-detail__product-quantity']}>
									Số lượng: <b>{item.quantity}</b>
								</div>
								<div className={styles['order-detail__product-unit-price']}>
									Đơn giá: <b>{toLocalePrice(item.unitPrice)}</b>
								</div>
								{item.discountAmount && (
									<div className={styles['order-detail__product-discount']}>
										Giảm giá: <b>{toLocalePrice(item.discountAmount)}</b>
									</div>
								)}
								<div className={styles['order-detail__product-subtotal']}>
									Tạm tính: <b>{toLocalePrice(item.subtotalPrice)}</b>
								</div>
							</div>
						</article>
					))}
				</section>

				<section className={styles['order-detail__summary']}>
					<h2>Thanh toán</h2>
					<dl className={styles['order-detail__summary__list']}>
						<dt>Tạm tính:</dt>
						<dd>{toLocalePrice(order.subtotalPrice)}</dd>
						{order.vatAmount && (
							<>
								<dt>VAT:</dt>
								<dd>{toLocalePrice(order.vatAmount)}</dd>
							</>
						)}
						{order.discountAmount && (
							<>
								<dt>Giảm giá:</dt>
								<dd>{toLocalePrice(order.discountAmount)}</dd>
							</>
						)}
						{order.shippingFee && (
							<>
								<dt>Phí vận chuyển:</dt>
								<dd>{toLocalePrice(order.shippingFee)}</dd>
							</>
						)}
						<dt className={styles['order-detail__summary__total-label']}>Thành tiền:</dt>
						<dd className={styles['order-detail__summary__total']}>{toLocalePrice(order.totalPrice)}</dd>
					</dl>
				</section>

				<nav className={styles['order-detail__actions']}>
					<Link href='/profile/orders' className='cta-button--primary' prefetch={false}>
						← Quay lại danh sách đơn hàng
					</Link>
				</nav>
			</div>
		</div>
	);
};

export default OrderDetailPage;
