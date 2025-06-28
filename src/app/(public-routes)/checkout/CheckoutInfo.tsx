'use client';
import React, { memo, useState } from 'react';
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
import Checkbox from '@/components/ui/checkbox/Checkbox';
import { TOrderPaymentMethod } from '@/interfaces/entity/order/order.entity';
import { PAYMENT_METHOD_TEXT_MAP } from '@/consts/map-value';

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
	onSubmitOrder: (paymentMethod: TOrderPaymentMethod) => void;
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
	const [paymentMethod, setPaymentMethod] = useState<TOrderPaymentMethod | null>(null);
	const [paymentMethodError, setPaymentMethodError] = useState<string | null>(null);
	const { isLoading: isAuthLoading } = useAuthContext();
	const { isGettingDeliveryInfo: isDeliveryInfoLoading } = useDeliveryInfoContext();
	const { loading: isCartLoading } = useCartContext();
	const { setLastStandingURL } = useLastStandingURL();

	const handleSubmitOrder = () => {
		if (!paymentMethod) {
			setPaymentMethodError('Vui lòng chọn phương thức thanh toán');
			return;
		} else {
			setPaymentMethodError(null);
		}

		onSubmitOrder(paymentMethod);
	};

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
				{
					title: 'Phương thức thanh toán',
					children: (
						<div className={styles['payment-methods']}>
							<Checkbox label={PAYMENT_METHOD_TEXT_MAP['cod']} id='payment-method-cod' onChange={() => setPaymentMethod('cod')} checked={paymentMethod === 'cod'} />
							<Checkbox label={PAYMENT_METHOD_TEXT_MAP['bank']} id='payment-method-bank' onChange={() => setPaymentMethod('bank')} checked={paymentMethod === 'bank'} />
							<Checkbox label={PAYMENT_METHOD_TEXT_MAP['cash']} id='payment-method-cash' onChange={() => setPaymentMethod('cash')} checked={paymentMethod === 'cash'} />
							{paymentMethodError && <span className={'error'}>{paymentMethodError}</span>}
						</div>
					),
				},
			]}
			className={clsx(styles.orderTable, styles.table)}
			loading={isCartLoading || isSubmitting || isAuthLoading || isDeliveryInfoLoading}
			footer={
				<>
					<button className={`cta-button--primary`} onClick={handleSubmitOrder} disabled={isAuthLoading || isDeliveryInfoLoading || isSubmitting || isCartLoading || items.length === 0}>
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
