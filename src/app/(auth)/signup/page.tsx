'use client';
import AuthForm from '@/components/ui/auth-form/AuthForm';
import { IResponse, TErrorFirst } from '@/interfaces';
import { ISignUpRequest } from '@/interfaces/api/auth/sign-up.interface';
import { isEmpty } from '@/util';
import { emailSchema, nameSchema, passwordSchema } from '@/util/validate-input.util';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import Swal from 'sweetalert2';

const fetchSignup = async (data: ISignUpRequest): Promise<TErrorFirst<any, null>> => {
	if (isEmpty(data.email) || isEmpty(data.name) || isEmpty(data.password) || isEmpty(data.confirmPassword)) {
		return ['Vui lòng điền đầy đủ thông tin', null];
	}

	if (data.password.trim() !== data.confirmPassword.trim()) {
		return ['Mật khẩu không khớp', null];
	}

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	const result: IResponse = await response.json();

	if (!response.ok || result.error) {
		return [result?.message || 'Đăng ký thất bại', null];
	}

	return [null, null];
};

const signupValidate = z.object({
	name: nameSchema,
	email: emailSchema,
	password: passwordSchema,
	confirmPassword: passwordSchema,
});

type SignupPageProps = {};

function SignupPage({}: SignupPageProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleSubmit = async (formData: any) => {
		if (isLoading) return;
		setIsLoading(true);
		try {
			const [error, result] = await fetchSignup(formData as ISignUpRequest);
			if (error) {
				await Swal.fire({
					icon: 'error',
					title: 'Lỗi',
					text: error,
					timer: 2000,
					showConfirmButton: false,
				});
			} else if (result === null) {
				await Swal.fire({
					icon: 'success',
					title: 'Thành công',
					text: 'Đăng ký thành công. Kiểm tra email để xác thực tài khoản.',
					timer: 2000,
					showConfirmButton: false,
				});
				router.push('/verify-email');
			}
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Lỗi',
				text: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.',
				timer: 2000,
				showConfirmButton: false,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthForm
			title='Đăng ký'
			subtitle='Đăng ký ngay để khám phá phong cách bản thân'
			fields={[
				{ label: 'Tên của bạn', name: 'name', placeholder: 'Nguyễn Văn A', required: true },
				{ label: 'Email của bạn', name: 'email', placeholder: 'example@gmail.com', required: true },
				{ type: 'password', label: 'Mật khẩu', name: 'password', placeholder: '*********', required: true },
				{ type: 'password', label: 'Nhập lại mật khẩu', name: 'confirmPassword', placeholder: '*********', required: true },
			]}
			submitText='Đăng ký'
			oauthProviders={[{ name: 'Google', iconSrc: '/svgs/google.svg', href: `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/start/google` }]}
			bottomText='Bạn đã có tài khoản ?'
			bottomLinkText='Đăng nhập ngay'
			bottomLinkHref='/signin'
			validateSchema={signupValidate}
			isSending={isLoading}
			onSubmit={handleSubmit}
		/>
	);
}

export default SignupPage;
