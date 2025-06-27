'use client';
import React, { memo } from 'react';
import Table from '@/components/ui/table/Table';
import styles from './Checkout.module.scss';
import clsx from 'clsx';
import { calcDiscountedPrice, toLocalePrice } from '@/util';
import { IProduct } from '@/interfaces';
import Link from 'next/link';
import useLastStandingURL from '@/hooks/useLastStandingURL';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import { useDeliveryInfoContext } from '@/contexts/DeliveryInfoContext/DeliveryInfoContextProvider';
import { useCartContext } from '@/contexts/CartContext/useCartContext';

interface CartItem {
	productId: string;
	quantity: number;
}

interface CheckoutInfoProps {
	items: CartItem[];
	products: Record<string, IProduct | null>;
	subtotal: number;
	vatAmount: number;
	total: number;
	isSubmitting: boolean;
	isAuthenticated: boolean;
	onSubmitOrder: () => void;
}

const OrderItems: React.FC<{
	items: CartItem[];
	products: Record<string, IProduct | null>;
}> = memo(({ items, products }) => {
	return (
		<ul className={styles.orderItems}>
			{items.map((item) => (
				<li className={styles.orderItem} key={item.productId}>
					<p className={styles.itemName}>{products[item.productId]?.name || 'Sản phẩm'}</p>
					<span className={styles.itemQuantity}>x {item.quantity}</span>
					<span className={styles.itemPrice}>
						{(calcDiscountedPrice(products[item.productId]?.price || 0, products[item.productId]?.discountPercent || 0, true) * item.quantity).toLocaleString('vi-VN', {
							style: 'currency',
							currency: 'VND',
						})}
					</span>
				</li>
			))}
		</ul>
	);
});
OrderItems.displayName = 'OrderItems';

const OrderSummary: React.FC<{
	subtotal: number;
	vatAmount: number;
	total: number;
}> = memo(({ subtotal, vatAmount, total }) => {
	return (
		<section className={styles.orderSummary}>
			<div className={clsx(styles.orderSummaryItem, styles.orderSummarySubtotal)}>
				<span className={styles.orderSummaryLabel}>Tạm tính</span>
				<span className={styles.orderSummaryValue}>{toLocalePrice(subtotal)}</span>
			</div>

			<div className={clsx(styles.orderSummaryItem, styles.orderSummaryVat)}>
				<span className={styles.orderSummaryLabel}>VAT</span>
				<span className={styles.orderSummaryValue}>{toLocalePrice(vatAmount)}</span>
			</div>

			<div className={clsx(styles.orderSummaryItem, styles.orderSummaryTotal)}>
				<span className={styles.orderSummaryLabel}>Tổng</span>
				<span className={styles.orderSummaryValue}>{toLocalePrice(total)}</span>
			</div>
		</section>
	);
});
OrderSummary.displayName = 'OrderSummary';

const CheckoutInfo: React.FC<CheckoutInfoProps> = memo(({ items, products, subtotal, vatAmount, total, isSubmitting, isAuthenticated, onSubmitOrder }) => {
	const { isLoading: isAuthLoading } = useAuthContext();
	const { isGettingDeliveryInfo: isDeliveryInfoLoading } = useDeliveryInfoContext();
	const { loading: isCartLoading } = useCartContext();
	const { setLastStandingURL } = useLastStandingURL();
	return (
		<Table
			sections={[
				{
					title: 'Thông tin đơn hàng',
					children: (
						<>
							<OrderItems items={items} products={products} />
							<OrderSummary subtotal={subtotal} vatAmount={vatAmount} total={total} />
						</>
					),
				},
			]}
			className={clsx(styles.orderTable, styles.table)}
			loading={isCartLoading || isSubmitting || isAuthLoading || isDeliveryInfoLoading}
			footer={
				<>
					<button className={`cta-button--primary`} onClick={onSubmitOrder} disabled={isAuthLoading || isDeliveryInfoLoading || isSubmitting || isCartLoading || items.length === 0}>
						{isSubmitting ? 'Đang xử lý...' : 'Đặt hàng ngay'}
					</button>
					{!isAuthenticated && (
						<Link className='cta-button--secondary' href='/signin' onClick={() => setLastStandingURL('/checkout')}>
							Đăng nhập để theo dõi đơn
						</Link>
					)}
					<div className={styles.orderFooterNote}>
						<span>Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất</span>
					</div>
				</>
			}
		/>
	);
});

CheckoutInfo.displayName = 'CheckoutInfo';

export default CheckoutInfo;
