// 'use client';
// import React, { useReducer, useEffect, useState } from 'react';
// import AppBody from '@/components/app-body/AppBody';
// import LabelInput from '@/components/label-input/LabelInput';
// import Table from '@/components/table/Table';
// import styles from './Checkout.module.scss';
// import Checkbox from '@/components/checkbox/Checkbox';
// import clsx from 'clsx';
// import tax from '@/data/tax.json';

// type State = {
// 	name: string;
// 	email: string;
// 	phone: string;
// 	address: string;
// 	additionalInfo: string;
// 	paymentMethod?: 'cod' | 'store' | 'bank';
// };

// type Action = { type: 'SET_FIELD'; field: keyof State; value: string | boolean } | { type: 'RESET' };

// const initialState: State = {
// 	name: '',
// 	email: '',
// 	phone: '',
// 	address: '',
// 	additionalInfo: '',
// 	paymentMethod: 'cod',
// };

// function reducer(state: State, action: Action): State {
// 	switch (action.type) {
// 		case 'SET_FIELD':
// 			return { ...state, [action.field]: action.value };
// 		case 'RESET':
// 			return initialState;
// 		default:
// 			return state;
// 	}
// }

// const VAT: number = parseInt(tax.VAT, 10) / 100;

// function Checkout() {
// 	const [state, dispatch] = useReducer(reducer, initialState);
// 	const [cart, setCart] = useState<ICart | null>(null);
// 	const [products, setProducts] = useState<Product[]>([]);
// 	const [loading, setLoading] = useState(true);

// 	const handleChangePaymentMethod = (method: 'cod' | 'store' | 'bank') => {
// 		dispatch({ type: 'SET_FIELD', field: 'paymentMethod', value: method });
// 	};

// 	// useEffect(() => {
// 	// 	const fetchCart = async () => {
// 	// 		setLoading(true);
// 	// 		const cartData = await getCart();
// 	// 		setCart(cartData);

// 	// 		const productPromises = cartData.items.map(async (cartItem) => {
// 	// 			const res = await getProductById(cartItem.productId);
// 	// 			return res.data as Product;
// 	// 		});
// 	// 		const products = await Promise.all(productPromises);
// 	// 		setProducts(products);
// 	// 		setLoading(false);
// 	// 	};
// 	// 	fetchCart();
// 	// }, []);

// 	const total = cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
// 	const vatAmount = total * VAT;

// 	return (
// 		<AppBody>
// 			<section className={styles.container}>
// 				<Table
// 					sections={[
// 						{
// 							title: 'Gửi tin nhắn cho chúng tôi',
// 							children: (
// 								<section className={styles.form}>
// 									<LabelInput
// 										placeholder='Nhập họ tên của bạn'
// 										label='Tên của bạn'
// 										name='name'
// 										required
// 										value={state.name}
// 										onChange={(e) =>
// 											dispatch({ type: 'SET_FIELD', field: 'name', value: e.target.value })
// 										}
// 									/>
// 									<LabelInput
// 										placeholder='example@gmail.com'
// 										label='Email của bạn'
// 										name='email'
// 										type='email'
// 										required
// 										value={state.email}
// 										onChange={(e) =>
// 											dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })
// 										}
// 									/>
// 									<LabelInput
// 										placeholder='0987654321'
// 										label='Số điện thoại'
// 										name='phone'
// 										type='text'
// 										required
// 										value={state.phone}
// 										onChange={(e) =>
// 											dispatch({ type: 'SET_FIELD', field: 'phone', value: e.target.value })
// 										}
// 									/>
// 									<LabelInput
// 										placeholder='Nhập tỉnh/thành phố của bạn'
// 										label='Tỉnh/Thành phố'
// 										name='address'
// 										required
// 										value={state.address || ''}
// 										onChange={(e) =>
// 											dispatch({ type: 'SET_FIELD', field: 'address', value: e.target.value })
// 										}
// 									/>
// 									<LabelInput
// 										placeholder='Ghi chú cho đơn hàng, ví dụ: thời gian giao hàng mong muốn hoặc hướng dẫn nhận hàng chi tiết hơn.'
// 										label='Thông tin bổ sung'
// 										name='additionalInfo'
// 										type='textarea'
// 										value={state.additionalInfo}
// 										onChange={(e) =>
// 											dispatch({
// 												type: 'SET_FIELD',
// 												field: 'additionalInfo',
// 												value: e.target.value,
// 											})
// 										}
// 									/>
// 								</section>
// 							),
// 						},
// 					]}
// 					className={clsx(styles.formTable, styles.table)}
// 				/>
// 				<Table
// 					sections={[
// 						{
// 							title: 'Thông tin đơn hàng',
// 							children: (
// 								<>
// 									<ul className={styles.orderItems}>
// 										{cart?.items.map((item, idx) => {
// 											const product = products.find((p) => p.id === item.productId);
// 											return (
// 												<li className={styles.orderItem} key={item.productId}>
// 													<p className={styles.itemName}>{product?.name || 'Sản phẩm'}</p>
// 													<span className={styles.itemQuantity}>x {item.quantity}</span>
// 													<span className={styles.itemPrice}>
// 														{(item.price * item.quantity).toLocaleString('vi-VN', {
// 															style: 'currency',
// 															currency: 'VND',
// 														})}
// 													</span>
// 												</li>
// 											);
// 										})}
// 									</ul>
// 									<section className={styles.orderSummary}>
// 										<div className={styles.orderSummaryItem}>
// 											<span className={styles.orderSummaryLabel}>Tổng cộng</span>
// 											<span className={styles.orderSummaryValue}>
// 												{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
// 											</span>
// 										</div>
// 										<div className={styles.orderSummaryItem}>
// 											<span className={styles.orderSummaryLabel}>VAT</span>
// 											<span className={styles.orderSummaryValue}>
// 												{vatAmount.toLocaleString('vi-VN', {
// 													style: 'currency',
// 													currency: 'VND',
// 												})}
// 											</span>
// 										</div>
// 										<div className={styles.orderSummaryItem}>
// 											<span className={styles.orderSummaryLabel}>Tổng thanh toán</span>
// 											<span className={styles.orderSummaryValue}>
// 												{(total + vatAmount).toLocaleString('vi-VN', {
// 													style: 'currency',
// 													currency: 'VND',
// 												})}
// 											</span>
// 										</div>
// 									</section>
// 								</>
// 							),
// 						},
// 						{
// 							title: 'Phương thức thanh toán',
// 							children: (
// 								<div className={styles.paymentMethods}>
// 									<Checkbox
// 										label='Thanh toán khi nhận hàng (COD)'
// 										name='paymentMethod'
// 										id='payment-cod'
// 										checked={state.paymentMethod === 'cod'}
// 										onChange={() => handleChangePaymentMethod('cod')}
// 										preventUncheck
// 										className={styles.paymentMethod}
// 									/>
// 									<Checkbox
// 										label='Thanh toán tại cửa hàng'
// 										name='paymentMethod'
// 										id='payment-store'
// 										checked={state.paymentMethod === 'store'}
// 										onChange={() => handleChangePaymentMethod('store')}
// 										preventUncheck
// 										className={styles.paymentMethod}
// 									/>
// 									<Checkbox
// 										label='Thanh toán qua ngân hàng / ví điện tử'
// 										name='paymentMethod'
// 										id='payment-bank'
// 										checked={state.paymentMethod === 'bank'}
// 										onChange={() => handleChangePaymentMethod('bank')}
// 										preventUncheck
// 										className={styles.paymentMethod}
// 									/>
// 								</div>
// 							),
// 						},
// 					]}
// 					className={clsx(styles.orderTable, styles.table)}
// 					loading={loading}
// 					footer={<button className={'cta-button'}>Đặt hàng ngay</button>}
// 				/>
// 			</section>
// 		</AppBody>
// 	);
// }

// export default Checkout;
import React from 'react';

type Props = {};

function page({}: Props) {
	return <div>page</div>;
}

export default page;
