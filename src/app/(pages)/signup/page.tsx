'use client';
import { LOCAL_STORAGE_KEYS } from '@/consts/keys';
import styles from './Signup.module.scss';
import AppBody from '@/components/layout/app-body/AppBody';
import AuthForm from '@/components/ui/auth-form/AuthForm';
import ModalAlert from '@/components/ui/modal-alert/ModalAlert';
import { IResponse, TErrorFirst } from '@/interfaces';
import { ISignUpRequest } from '@/interfaces/api/auth/sign-up.interface';
import { isEmpty } from '@/util';
import { emailSchema, nameSchema, passwordSchema } from '@/util/validate-input.util';
import React, { useState } from 'react';
import { z } from 'zod';

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
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleClearErrorMessage = () => {
		setErrorMessage(null);
	};

	const handleClearSuccessMessage = () => {
		localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFY_EMAIL_COUNTDOWN, (Date.now() - 30 * 1000).toString());
		window.location.href = '/verify-email';
	};

	const handleSubmit = async (formData: any) => {
		const [error, result] = await fetchSignup(formData as ISignUpRequest);
		if (error) {
			setErrorMessage(error);
			return;
		}
		if (result === null) {
			setSuccessMessage('Đăng ký thành công. Kiểm tra email để xác thực tài khoản.');
		}
	};

	return (
		<AppBody sectionClassName={styles.customSection}>
			<AuthForm
				title='Đăng ký'
				subtitle='Đăng ký ngay để khám phá phong cách bản thân'
				fields={[
					{ label: 'Tên của bạn', name: 'name', placeholder: 'Nguyễn Văn A', required: true },
					{ label: 'Email của bạn', name: 'email', placeholder: 'example@gmail.com', required: true },
					{ type: 'password', label: 'Mật khẩu', name: 'password', placeholder: '*********', required: true },
					{ type: 'password', label: 'Xác nhận mật khẩu', name: 'confirmPassword', placeholder: '*********', required: true },
				]}
				submitText='Đăng ký'
				oauthProviders={[
					{ name: 'Facebook', iconSrc: '/svgs/facebook.svg', href: '#' },
					{ name: 'Google', iconSrc: '/svgs/google.svg', href: '#' },
				]}
				bottomText='Bạn đã có tài khoản ?'
				bottomLinkText='Đăng nhập ngay'
				bottomLinkHref='/signin'
				validateSchema={signupValidate}
				onSubmit={handleSubmit}
			/>

			{successMessage && <ModalAlert type='success' title='Thành công' message={successMessage} onClose={() => handleClearSuccessMessage()} />}
			{errorMessage && <ModalAlert type='error' title='Lỗi' message={errorMessage} onClose={() => handleClearErrorMessage()} />}
		</AppBody>
	);
}

export default SignupPage;
