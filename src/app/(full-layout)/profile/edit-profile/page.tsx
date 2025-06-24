'use client';
import styles from '../Profile.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import api from '@/services/http-client/axios-interceptor';
import { loggerService } from '@/services/logger.service';
import { IResponse } from '@/interfaces';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import LabelInput from '@/components/ui/label-input/LabelInput';
import { nameSchema, phoneSchema } from '@/util/validate-input.util';
import { IUpdateDeliveryInfoRequestData } from '@/interfaces/api/user/update-delivery-info.interface';
import Swal from 'sweetalert2';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';

const editProfileValidate = z.object({
	name: nameSchema,
	phone: phoneSchema,
});

export default function EditProfile() {
	const { updateUser } = useAuthContext();
	const [isLoading, setIsLoading] = useState(true);
	const [form, setForm] = useState<IUpdateDeliveryInfoRequestData>({
		name: '',
		phone: '',
	});
	const [validateError, setValidateError] = useState<Record<string, string>>({});
	const [submitable, setSubmitable] = useState(false);

	// Fetch user delivery info on component mount
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await api.get('/user/delivery-info');
				const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

				if (response.status !== 200) {
					throw new Error(responseData?.message || 'Không thể lấy thông tin giao hàng');
				}

				const data = responseData.data as IGetDeliveryInfoResponseData;
				setForm({
					name: data.name || '',
					phone: data.phone || '',
				});

				return data;
			} catch (error) {
				loggerService.error('Lỗi khi lấy thông tin giao hàng:', error);
				Swal.fire({
					icon: 'error',
					title: 'Lỗi',
					text: 'Không thể lấy thông tin giao hàng',
				});
			} finally {
				setIsLoading(false);
				loggerService.info('Đã hoàn thành việc lấy thông tin giao hàng');
			}
		};

		fetchUserData();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		const fieldSchema = editProfileValidate.shape[name as keyof typeof editProfileValidate.shape];
		const validationResult = fieldSchema.safeParse(value);

		setForm((prev) => ({ ...prev, [name]: value }));
		setValidateError((prev) => ({
			...prev,
			[name]: validationResult.success ? '' : validationResult.error.errors[0].message,
		}));

		setTimeout(() => {
			const updatedForm = { ...form, [name]: value };
			const hasErrors = Object.values(validateError).some((error) => error !== '');
			const hasEmptyFields = Object.values(updatedForm).some((val) => !val.toString().trim());
			setSubmitable(!hasErrors && !hasEmptyFields);
		}, 0);
	};

	const handleReset = useCallback(() => {
		setForm({
			name: form.name || '',
			phone: form.phone || '',
		});
		setValidateError({});
		setSubmitable(false);
	}, [form.name, form.phone]);

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

		setIsLoading(true);

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
		} catch (error) {
			loggerService.error('Lỗi khi cập nhật thông tin giao hàng:', error);
			Swal.fire({
				icon: 'error',
				title: 'Lỗi!',
				text: 'Cập nhật thông tin giao hàng thất bại',
			});
		} finally {
			setIsLoading(false);
			loggerService.info('Đã hoàn thành việc cập nhật thông tin giao hàng');
		}
	};

	return (
		<div className={styles.part}>
			<span className={styles.part__title}>Chỉnh sửa thông tin giao hàng</span>
			{isLoading ? (
				<p>Đang tải...</p>
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
