'use client';
import React, { useReducer, useState } from 'react';
import AppBody from '@/components/layout/app-body/AppBody';
import LabelInput from '@/components/ui/label-input/LabelInput';
import Table from '@/components/ui/table/Table';
import styles from './Checkout.module.scss';
import clsx from 'clsx';
import tax from '@/data/tax.json';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import { toLocalePrice } from '@/util';

type State = {
	name: string;
	email: string;
	phone: string;
	address: string;
	additionalInfo: string;
};

type Action = { type: 'SET_FIELD'; field: keyof State; value: string | boolean } | { type: 'RESET' };

const initialState: State = {
	name: '',
	email: '',
	phone: '',
	address: '',
	additionalInfo: '',
};

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'SET_FIELD':
			return { ...state, [action.field]: action.value };
		case 'RESET':
			return initialState;
		default:
			return state;
	}
}

const VAT: number = parseInt(tax.VAT, 10) / 100;

function CheckoutPage() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { items, products, loading } = useCartContext();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const total = items.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0) || 0;
	const vatAmount = total * VAT;

	const handleSubmitOrder = async () => {
		if (!state.name || !state.email || !state.phone || !state.address) {
			// Validate required fields
			alert('Vui lòng điền đầy đủ thông tin bắt buộc');
			return;
		}

		setIsSubmitting(true);
		try {
			// Example order submission API call
			// await fetch('/api/v1/orders', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({
			//     customerInfo: state,
			//     items: items,
			//     total: total,
			//     vatAmount: vatAmount,
			//     totalWithVat: total + vatAmount
			//   })
			// });

			console.log('Order submitted', {
				customerInfo: state,
				items: items,
				total: total,
				vatAmount: vatAmount,
				totalWithVat: total + vatAmount,
			});

			// Reset form after successful submission
			dispatch({ type: 'RESET' });

			// Optionally redirect to confirmation page
			// router.push('/order-confirmation');
		} catch (error) {
			console.error('Error submitting order:', error);
			alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AppBody>
			<section className={styles.container}>
				<Table
					sections={[
						{
							title: 'Thông tin khách hàng',
							children: (
								<section className={styles.form}>
									<LabelInput
										placeholder='Nhập họ tên của bạn'
										label='Tên của bạn'
										name='name'
										required
										value={state.name}
										onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })}
									/>
									<LabelInput
										placeholder='example@gmail.com'
										label='Email của bạn'
										name='email'
										type='email'
										required
										value={state.email}
										onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
									/>
									<LabelInput
										placeholder='0987654321'
										label='Số điện thoại'
										name='phone'
										type='text'
										required
										value={state.phone}
										onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value })}
									/>
									<LabelInput
										placeholder='Nhập tỉnh/thành phố của bạn'
										label='Tỉnh/Thành phố'
										name='address'
										required
										value={state.address || ''}
										onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'address', value: e.target.value })}
									/>
									<LabelInput
										placeholder='Ghi chú cho đơn hàng'
										label='Thông tin bổ sung'
										name='additionalInfo'
										type='textarea'
										value={state.additionalInfo}
										onChange={(e) =>
											dispatch({
												type: 'SET_FIELD',
												field: 'additionalInfo',
												value: e.target.value,
											})
										}
									/>
								</section>
							),
						},
					]}
					className={clsx(styles.formTable, styles.table)}
				/>
				<Table
					sections={[
						{
							title: 'Thông tin đơn hàng',
							children: (
								<>
									<ul className={styles.orderItems}>
										{items.map((item) => {
											return (
												<li className={styles.orderItem} key={item.productId}>
													<p className={styles.itemName}>{products[item.productId]?.name || 'Sản phẩm'}</p>
													<span className={styles.itemQuantity}>x {item.quantity}</span>
													<span className={styles.itemPrice}>
														{(products[item.productId]?.price || 0 * item.quantity).toLocaleString('vi-VN', {
															style: 'currency',
															currency: 'VND',
														})}
													</span>
												</li>
											);
										})}
									</ul>
									<section className={styles.orderSummary}>
										<div className={clsx(styles.orderSummaryItem, styles.orderSummarySubtotal)}>
											<span className={styles.orderSummaryLabel}>Tạm tính</span>
											<span className={styles.orderSummaryValue}>{toLocalePrice(total)}</span>
										</div>
										{vatAmount > 0 && (
											<div className={clsx(styles.orderSummaryItem, styles.orderSummaryVat)}>
												<span className={styles.orderSummaryLabel}>VAT</span>
												<span className={styles.orderSummaryValue}>{toLocalePrice(vatAmount)}</span>
											</div>
										)}
										<div className={clsx(styles.orderSummaryItem, styles.orderSummaryTotal)}>
											<span className={styles.orderSummaryLabel}>Tổng</span>
											<span className={styles.orderSummaryValue}>{toLocalePrice(total + vatAmount)}</span>
										</div>
									</section>
								</>
							),
						},
					]}
					className={clsx(styles.orderTable, styles.table)}
					loading={loading || isSubmitting}
					footer={
						<button className={'cta-button'} onClick={handleSubmitOrder} disabled={isSubmitting || loading || items.length === 0}>
							{isSubmitting ? 'Đang xử lý...' : 'Đặt hàng ngay'}
						</button>
					}
				/>
			</section>
		</AppBody>
	);
}

export default CheckoutPage;
