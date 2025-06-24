'use client';
import AppBody from '@/components/layout/app-body/AppBody';
import AuthForm from '@/components/ui/auth-form/AuthForm';
import { IResponse, TErrorFirst } from '@/interfaces';
import { isEmpty } from '@/util';
import { emailSchema, passwordSchema } from '@/util/validate-input.util';
import React, { useState } from 'react';
import { z } from 'zod';
import { IResetPasswordRequest } from '@/interfaces/api/auth/reset-password.interface';
import Swal from 'sweetalert2';

const fetchResetPassword = async (data: IResetPasswordRequest): Promise<TErrorFirst<any, null>> => {
	if (isEmpty(data.email) || isEmpty(data.newPassword) || isEmpty(data.confirmPassword)) {
		return ['Thông tin không đầy đủ', null];
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const result: IResponse = await response.json();

		if (!response.ok || result.error) {
			return [result?.message || 'Đặt lại mật khẩu thất bại', null];
		}
		return [null, null];
	} catch (error) {
		return ['Đã xảy ra lỗi khi kết nối đến máy chủ', null];
	}
};

const resetPasswordSchema = z.object({
	email: emailSchema,
	newPassword: passwordSchema,
	confirmPassword: passwordSchema,
});

function ResetPasswordPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (formData: any) => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			const [error, _] = await fetchResetPassword(formData as IResetPasswordRequest);
			if (error) {
				await Swal.fire({
					icon: 'error',
					title: 'Lỗi',
					text: error,
					timer: 2000,
					showConfirmButton: false,
				});
				return;
			}

			await Swal.fire({
				icon: 'success',
				title: 'Thành công',
				text: 'Kiểm tra email để xác nhận đặt lại mật khẩu',
				timer: 2000,
				showConfirmButton: false,
			});
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Lỗi',
				text: 'Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại sau.',
				timer: 2000,
				showConfirmButton: false,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthForm
			title='Đặt lại mật khẩu'
			subtitle='Vui lòng nhập mật khẩu mới của bạn'
			fields={[
				{
					label: 'Email của bạn',
					name: 'email',
					placeholder: 'example@gmail.com',
					required: true,
				},
				{
					label: 'Mật khẩu mới',
					name: 'newPassword',
					type: 'password',
					placeholder: '********',
					required: true,
				},
				{
					label: 'Nhập lại mật khẩu',
					name: 'confirmPassword',
					type: 'password',
					placeholder: '********',
					required: true,
				},
			]}
			submitText='Đặt lại mật khẩu'
			isSending={isLoading}
			validateSchema={resetPasswordSchema}
			onSubmit={handleSubmit}
			bottomText={'Đã hoàn thành ?'}
			bottomLinkText='Quay lại đăng nhập'
			bottomLinkHref='/signin'
		/>
	);
}

export default ResetPasswordPage;
