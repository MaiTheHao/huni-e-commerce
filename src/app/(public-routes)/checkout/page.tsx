'use client';
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import styles from './Checkout.module.scss';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import { emailSchema, nameSchema, phoneSchema } from '@/util/validate-input.util';
import tax from '@/data/tax.json';
import CheckoutForm from './CheckoutForm';
import CheckoutInfo from './CheckoutInfo';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useDeliveryInfoContext } from '@/contexts/DeliveryInfoContext/DeliveryInfoContextProvider';
import { ICreateOrderRequestData, IProduct, TErrorFirst } from '@/interfaces';
import { anonymousCreateOrder, authedCreateOrder } from './apis';
import { calcDiscountAmount, calcDiscountedPrice, calcVATAmount, toString } from '@/util';
import { IOrderItem, TOrderPaymentMethod } from '@/interfaces/entity/order/order.entity';

const checkoutValidate = z.object({
	name: nameSchema,
	email: emailSchema,
	phone: phoneSchema,
	address: z.string().min(1, 'Địa chỉ giao hàng là bắt buộc'),
	additionalInfo: z.string().optional(),
});

type FormData = {
	name: string;
	email: string;
	phone: string;
	address: string;
	additionalInfo: string;
};

type State = {
	formData: FormData;
};

type Action = { type: 'SET_FORM'; formData: Partial<FormData> } | { type: 'RESET' };

const initialFormData: FormData = {
	name: '',
	email: '',
	phone: '',
	address: '',
	additionalInfo: '',
};

const initialState: State = {
	formData: initialFormData,
};

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'SET_FORM':
			return {
				...state,
				formData: { ...state.formData, ...action.formData },
			};
		case 'RESET':
			return initialState;
		default:
			return state;
	}
}

const VAT: number = parseInt(tax.VAT, 10) / 100;

function CheckoutPage() {
	const { deliveryInfo } = useDeliveryInfoContext();
	const { isAuthenticated } = useAuthGuard({ immediate: false });
	const { items, products, loading: isCartLoading, handleRemoveAll } = useCartContext();
	const [state, dispatch] = useReducer(reducer, initialState);
	const [validateError, setValidateError] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const subtotal = useMemo(() => {
		return items.reduce((sum, item) => sum + (calcDiscountedPrice(products[item.productId]?.price || 0, products[item.productId]?.discountPercent || 0, true) || 0) * item.quantity, 0) || 0;
	}, [items, products]);

	const vatAmount = calcVATAmount(subtotal, VAT, true, 1000);

	const total = subtotal + vatAmount;

	const handleSubmitOrder = useCallback(
		async (paymentMethod: TOrderPaymentMethod) => {
			const result = checkoutValidate.safeParse(state.formData);
			if (!result.success) {
				const errors: Record<string, string> = {};
				result.error.errors.forEach((error: z.ZodIssue) => {
					if (error.path[0]) {
						errors[error.path[0] as string] = error.message;
					}
				});
				setValidateError(errors);
				Swal.fire('Thông tin không hợp lệ', 'Vui lòng kiểm tra lại thông tin đã nhập.', 'error');
				return;
			}

			setValidateError({});
			setIsSubmitting(true);
			try {
				let response: TErrorFirst<any, null>;
				let orderSubtotalPrice = 0;

				const orderItems: IOrderItem[] = items.map((item) => {
					const product: IProduct = products[item.productId] as IProduct;
					const discountedPrice: number = calcDiscountedPrice(product.price, product.discountPercent, true, 1000);
					const discountAmount: number = calcDiscountAmount(product.price, product.discountPercent, true, 1000);
					const subtotalPrice: number = discountedPrice * item.quantity;

					orderSubtotalPrice += subtotalPrice;

					return {
						productId: toString(item.productId),
						productName: toString(product.name),
						productImage: toString(product.images[0]),
						productCategory: toString(product.productType),
						quantity: Number(item.quantity),
						unitPrice: discountedPrice,
						subtotalPrice: subtotalPrice,
						discountAmount: discountAmount,
					};
				});

				const orderDiscountAmount = 0;
				const shippingFee = 0;
				const orderVatAmount = calcVATAmount(orderSubtotalPrice, VAT, true, 1000);
				const orderTotalPrice = orderSubtotalPrice + orderVatAmount;

				const orderData: ICreateOrderRequestData = {
					customerName: state.formData.name,
					customerEmail: state.formData.email,
					customerPhone: state.formData.phone,
					customerAddress: state.formData.address,
					additionalInfo: state.formData.additionalInfo,
					items: orderItems,
					paymentMethod: paymentMethod,
					subtotalPrice: orderSubtotalPrice,
					vatAmount: orderVatAmount,
					discountAmount: orderDiscountAmount,
					shippingFee: shippingFee,
					totalPrice: orderTotalPrice,
				};

				if (isAuthenticated) {
					response = await authedCreateOrder(orderData);
				} else {
					response = await anonymousCreateOrder(orderData);
				}

				if (response[0]) {
					Swal.fire('Đặt hàng thất bại', response[0], 'error');
					return;
				}
				await handleRemoveAll();
				Swal.fire('Đặt hàng thành công', 'Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.', 'success');
			} catch (error) {
				console.error('Error submitting order:', error);
				Swal.fire('Đặt hàng thất bại', 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.', 'error');
			} finally {
				setIsSubmitting(false);
			}
		},
		[state.formData, items, total, vatAmount]
	);

	const validateField = useCallback((name: string, value: string) => {
		const fieldSchema = checkoutValidate.shape[name as keyof typeof checkoutValidate.shape];
		if (!fieldSchema) return '';

		const status = fieldSchema.safeParse(value);
		return status.success ? '' : status.error.errors[0].message;
	}, []);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;

			const error = validateField(name, value);

			setValidateError((prev) => {
				const newValidateError = {
					...prev,
					[name]: error,
				};

				dispatch({ type: 'SET_FORM', formData: { [name]: value } as Partial<FormData> });
				return newValidateError;
			});
		},
		[state.formData, validateField]
	);

	useEffect(() => {
		if (!deliveryInfo) return;
		dispatch({
			type: 'SET_FORM',
			formData: {
				name: deliveryInfo.name,
				email: deliveryInfo.email,
				phone: deliveryInfo.phone,
				address: deliveryInfo.addresses[0],
			},
		});
	}, [deliveryInfo]);

	return (
		<section className={styles.container}>
			<CheckoutForm formData={state.formData} validateError={validateError} onInputChange={handleInputChange} />
			<CheckoutInfo
				items={items}
				products={products}
				subtotal={subtotal}
				total={total}
				vatAmount={vatAmount}
				isSubmitting={isSubmitting}
				isAuthenticated={isAuthenticated}
				onSubmitOrder={handleSubmitOrder}
			/>
		</section>
	);
}

export default CheckoutPage;
