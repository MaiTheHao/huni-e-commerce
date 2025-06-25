'use client';
import styles from '../Profile.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { loggerService } from '@/services/logger.service';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import LabelInput from '@/components/ui/label-input/LabelInput';
import { nameSchema, phoneSchema } from '@/util/validate-input.util';
import { IUpdateDeliveryInfoRequestData } from '@/interfaces/api/user/update-delivery-info.interface';
import Swal from 'sweetalert2';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import { useDeliveryInfoContext } from '@/contexts/DeliveryInfoContext/DeliveryInfoContextProvider';
import api from '@/services/http-client/axios-interceptor';
import { IResponse } from '@/interfaces';
import Spinner from '@/components/ui/spinner/Spinner';
import { isEmpty } from '@/util';

const editProfileValidate = z.object({
	name: nameSchema,
	phone: phoneSchema,
});

export default function EditProfile() {
	const { deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo } = useDeliveryInfoContext();
	const { updateUser } = useAuthContext();
	const [form, setForm] = useState<IUpdateDeliveryInfoRequestData>({
		name: deliveryInfo?.name || '',
		phone: deliveryInfo?.phone || '',
	});

	const [validateError, setValidateError] = useState<Record<string, string>>({});
	const [submitable, setSubmitable] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		const fieldSchema = editProfileValidate.shape[name as keyof typeof editProfileValidate.shape];
		const validationResult = fieldSchema.safeParse(value);

		const updatedForm = { ...form, [name]: value };
		const updatedError = { ...validateError, [name]: validationResult.success ? '' : validationResult.error.errors[0].message };
		const isSubmitable = Object.keys(updatedError).every((key) => !updatedError[key]) && Object.values(updatedForm).every((val) => !isEmpty(val));

		setForm(updatedForm);
		setValidateError(updatedError);
		setSubmitable(isSubmitable);
	};

	const handleReset = useCallback(() => {
		setForm({
			name: deliveryInfo?.name || '',
			phone: deliveryInfo?.phone || '',
		});
		setValidateError({});
		setSubmitable(false);
	}, [deliveryInfo]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const result = editProfileValidate.safeParse(form);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.errors.forEach((error) => {
				if (error.path[0]) {
					errors[error.path[0] as string] = error.message;
				}
			});

			setValidateError(errors);
			Swal.fire({
				icon: 'error',
				title: 'Thông tin không hợp lệ',
				text: 'Vui lòng kiểm tra lại thông tin đã nhập.',
			});
			return;
		}

		try {
			const response = await api.post('/user/delivery-info', form);
			const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

			if (response.status !== 200) {
				throw new Error(responseData?.message || 'Không thể cập nhật thông tin giao hàng');
			}

			const data = responseData.data as IGetDeliveryInfoResponseData;
			updateUser({ name: data.name });

			Swal.fire({
				icon: 'success',
				title: 'Thành công!',
				text: 'Cập nhật thông tin giao hàng thành công!',
			});

			setSubmitable(false);
			await refetchDeliveryInfo();
		} catch (error) {
			loggerService.error('Lỗi khi cập nhật thông tin giao hàng:', error);
			Swal.fire({
				icon: 'error',
				title: 'Lỗi!',
				text: 'Cập nhật thông tin giao hàng thất bại',
			});
		} finally {
			loggerService.info('Đã hoàn thành việc cập nhật thông tin giao hàng');
		}
	};

	useEffect(() => {
		if (deliveryInfo) {
			// const isSubmitable = deliveryInfo.name && deliveryInfo.phone;
			// setSubmitable(!!isSubmitable);
			setForm({
				name: deliveryInfo.name || '',
				phone: deliveryInfo.phone || '',
			});
		}
	}, [deliveryInfo]);

	return (
		<div className={styles.part}>
			<span className={styles.part__title}>Chỉnh sửa thông tin giao hàng</span>
			{isGettingDeliveryInfo ? (
				<p className={styles['part__loading-state']}>
					<Spinner /> Đang tải thông tin giao hàng...
				</p>
			) : (
				<form onSubmit={handleSubmit} className={styles['edit-profile-form']}>
					<span className='note'>Chức năng này đang được cải thiện.</span>
					<LabelInput label='Tên' name='name' required value={form.name} onChange={handleChange} className={styles['edit-profile-form__input']} validateError={validateError.name} />
					<LabelInput
						label='Số điện thoại'
						name='phone'
						required
						value={form.phone}
						onChange={handleChange}
						className={styles['edit-profile-form__input']}
						validateError={validateError.phone}
					/>
					<div className={styles['edit-profile-form__actions']}>
						<button
							type='button'
							className={`${styles['edit-profile-form__actions__button']} ${styles['edit-profile-form__actions__button--reset']} cta-button--danger`}
							onClick={handleReset}
						>
							Đặt lại
						</button>
						<button
							type='submit'
							disabled={!submitable}
							className={`${styles['edit-profile-form__actions__button']} ${styles['edit-profile-form__actions__button--submit']} cta-button--primary ${!submitable ? 'disabled' : ''}`}
						>
							Cập nhật thông tin
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
