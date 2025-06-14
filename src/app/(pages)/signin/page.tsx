'use client';
import styles from './Signin.module.scss';
import AppBody from '@/components/layout/app-body/AppBody';
import AuthForm from '@/components/ui/auth-form/AuthForm';
import ModalAlert from '@/components/ui/modal-alert/ModalAlert';
import { IResponse, TErrorFirst } from '@/interfaces';
import { ISigninRequest, ISigninResponse } from '@/interfaces/api/auth/sign-in.interface';
import { emailSchema, passwordSchema } from '@/util/validate-input.util';
import React, { useState } from 'react';
import { z } from 'zod';

const fetchSignin = async (data: ISigninRequest): Promise<TErrorFirst<any, ISigninResponse>> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	const result: IResponse = await response.json();

	if (!response.ok || (!result.error && !result.data)) {
		return [result?.message || 'Đăng nhập thất bại', null];
	}

	return [null, result as ISigninResponse];
};

const signinValidate = z.object({
	email: emailSchema,
	password: passwordSchema,
});

type SigninPageProps = {};

function SigninPage({}: SigninPageProps) {
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleClearErrorMessage = () => {
		setErrorMessage(null);
	};

	const handleClearSuccessMessage = () => {
		setSuccessMessage(null);
		// Add any navigation or state update after successful login
	};

	const handleSubmit = async (formData: any) => {
		const [error, result] = await fetchSignin(formData as ISigninRequest);
		if (error) {
			setErrorMessage(error);
			return;
		}
		if (result) {
			setSuccessMessage('Đăng nhập thành công');
			console.log('Access Token:', result.accessToken);
		}
	};

	return (
		<AppBody sectionClassName={styles.customSection}>
			<AuthForm
				title='Đăng nhập'
				subtitle='Đăng nhập ngay để khẳng định phong cách bản thân'
				fields={[
					{ label: 'Email của bạn', name: 'email', placeholder: 'example@gmail.com', required: true },
					{ type: 'password', label: 'Mật khẩu', name: 'password', placeholder: '*********', required: true },
				]}
				submitText='Đăng nhập'
				additionalLink={[
					{
						text: 'Chưa xác thực email ?',
						href: '/verify-email	',
					},
				]}
				oauthProviders={[
					{ name: 'Facebook', iconSrc: '/svgs/facebook.svg', href: '#' },
					{ name: 'Google', iconSrc: '/svgs/google.svg', href: '#' },
				]}
				bottomText='Bạn chưa có tài khoản ?'
				bottomLinkText='Đăng ký ngay'
				bottomLinkHref='/signup'
				validateSchema={signinValidate}
				onSubmit={handleSubmit}
			/>

			{successMessage && <ModalAlert type='success' title='Thành công' message={successMessage} onClose={() => handleClearSuccessMessage()} />}
			{errorMessage && <ModalAlert type='error' title='Lỗi' message={errorMessage} onClose={() => handleClearErrorMessage()} />}
		</AppBody>
	);
}

export default SigninPage;
