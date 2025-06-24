'use client';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import styles from './Checkout.module.scss';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { IResponse, TErrorFirst } from '@/interfaces';
import { emailSchema, nameSchema, phoneSchema } from '@/util/validate-input.util';
import tax from '@/data/tax.json';
import api from '@/services/http-client/axios-interceptor';
import CheckoutForm from './CheckoutForm';
import CheckoutInfo from './CheckoutInfo';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { toString } from '@/util';

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
	submitable: boolean;
};

type Action = { type: 'SET_FORM'; formData: Partial<FormData> } | { type: 'RESET' } | { type: 'SET_SUBMITABLE'; value: boolean };

const initialFormData: FormData = {
	name: '',
	email: '',
	phone: '',
	address: '',
	additionalInfo: '',
};

const initialState: State = {
	formData: initialFormData,
	submitable: false,
};

const fetchUserDeliveryInfo = async (): Promise<TErrorFirst<any, IGetDeliveryInfoResponseData | null>> => {
	try {
		const response = await api.get('/user/delivery-info');
		const responseData = response.data as IResponse<IGetDeliveryInfoResponseData>;
		if (responseData.error || !responseData.data) {
			return [responseData.message, null];
		}
		return [null, responseData.data];
	} catch (error) {
		return [error, null];
	}
};

function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'SET_FORM':
			return {
				...state,
				formData: { ...state.formData, ...action.formData },
			};
		case 'SET_SUBMITABLE':
			return { ...state, submitable: action.value };
		case 'RESET':
			return initialState;
		default:
			return state;
	}
}

const VAT: number = parseInt(tax.VAT, 10) / 100;

function CheckoutPage() {
	const { isAuthenticated } = useAuthGuard({
		immediate: false,
	});
	const [state, dispatch] = useReducer(reducer, initialState);
	const { items, products, loading } = useCartContext();
	const [validateError, setValidateError] = useState<Record<string, string>>({});
	const [isGettingDeliveryInfo, setIsGettingDeliveryInfo] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const total = items.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0) || 0;
	const vatAmount = total * VAT;

	const handleSubmitOrder = useCallback(async () => {
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
			await new Promise((resolve) => setTimeout(resolve, 3000));
			console.log('Order submitted', {
				customerInfo: state.formData,
				items: items,
				total: total,
				vatAmount: vatAmount,
				totalWithVat: total + vatAmount,
			});
			Swal.fire('Đặt hàng thành công', 'Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.', 'success');
		} catch (error) {
			console.error('Error submitting order:', error);
			Swal.fire('Đặt hàng thất bại', 'Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.', 'error');
		} finally {
			setIsSubmitting(false);
		}
	}, [state.formData, items, total, vatAmount]);

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

				const updatedFormData = { ...state.formData, [name]: value };
				const isSubmitable =
					Object.keys(newValidateError).every((key) => !newValidateError[key]) &&
					Object.entries(updatedFormData)
						.filter(([key]) => key !== 'additionalInfo')
						.every(([, val]) => toString(val)?.trim() !== '');

				dispatch({ type: 'SET_FORM', formData: { [name]: value } as Partial<FormData> });
				dispatch({ type: 'SET_SUBMITABLE', value: isSubmitable });
				return newValidateError;
			});
		},
		[state.formData, validateField]
	);

	useEffect(() => {
		const fetchAndSetDeliveryInfo = async () => {
			setIsGettingDeliveryInfo(true);
			const [error, data] = await fetchUserDeliveryInfo();
			if (!error && data) {
				dispatch({
					type: 'SET_FORM',
					formData: {
						name: data.name,
						email: data.email,
						phone: data.phone,
						address: data.addresses[0],
					},
				});
			} else if (error) {
				console.error('Error fetching user delivery info:', error);
			}
			setIsGettingDeliveryInfo(false);
		};

		fetchAndSetDeliveryInfo();
	}, []);

	return (
		<section className={styles.container}>
			<CheckoutForm formData={state.formData} validateError={validateError} loading={loading || isGettingDeliveryInfo} onInputChange={handleInputChange} />

			<CheckoutInfo
				items={items}
				products={products}
				total={total}
				vatAmount={vatAmount}
				loading={loading}
				isSubmitting={isSubmitting}
				submitable={state.submitable}
				isAuthenticated={isAuthenticated}
				onSubmitOrder={handleSubmitOrder}
			/>
		</section>
	);
}

export default CheckoutPage;
