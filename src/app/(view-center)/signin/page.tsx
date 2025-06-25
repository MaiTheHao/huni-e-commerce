'use client';
import { z } from 'zod';
import AuthForm from '@/components/ui/auth-form/AuthForm';
import { IResponse, TErrorFirst } from '@/interfaces';
import { ISigninRequest, ISigninResponseData } from '@/interfaces/api/auth/sign-in.interface';
import { emailSchema, passwordSchema } from '@/util/validate-input.util';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import Swal from 'sweetalert2';
import useLastStandingURL from '@/hooks/useLastStandingURL';

const fetchSignin = async (data: ISigninRequest): Promise<TErrorFirst<any, IResponse<ISigninResponseData>>> => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	const result: IResponse<ISigninResponseData> = await response.json();

	if (!response.ok || (!result.error && !result.data)) {
		return [result?.message || 'Đăng nhập thất bại', null];
	}

	return [null, result];
};

const signinValidate = z.object({
	email: emailSchema,
	password: passwordSchema,
});

type SigninPageProps = {};

function SigninPage({}: SigninPageProps) {
	const { login } = useAuthContext();
	const { getLastStandingURL, setLastStandingURL } = useLastStandingURL();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();

	const handleSubmit = async (formData: any) => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			const [error, result] = await fetchSignin(formData as ISigninRequest);
			if (error) {
				await Swal.fire({
					icon: 'error',
					title: 'Đăng nhập thất bại',
					text: error,
					timer: 1500,
					timerProgressBar: true,
					showConfirmButton: false,
				});
				return;
			}
			if (result) {
				login(result.data?.accessToken || '');
				await Swal.fire({
					icon: 'success',
					title: 'Đăng nhập thành công',
					text: 'Chào mừng bạn đã đăng nhập thành công, bạn sẽ được chuyển hướng ngay.',
					timer: 1500,
					timerProgressBar: true,
					showConfirmButton: false,
				});
				const lastStandingURL = getLastStandingURL();

				if (lastStandingURL) router.push(lastStandingURL);
				else router.push('/home');

				setLastStandingURL(null);
			}
		} catch (error) {
			await Swal.fire({
				icon: 'error',
				title: 'Đăng nhập thất bại',
				text: 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.',
				timer: 2000,
				timerProgressBar: true,
				showConfirmButton: false,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
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
					text: 'Quên mật khẩu ?',
					href: '/reset-password',
				},
				{
					text: 'Chưa xác thực email ?',
					href: '/verify-email',
				},
			]}
			oauthProviders={[{ name: 'Google', iconSrc: '/svgs/google.svg', href: `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/start/google` }]}
			bottomText='Bạn chưa có tài khoản ?'
			bottomLinkText='Đăng ký ngay'
			bottomLinkHref='/signup'
			validateSchema={signinValidate}
			isSending={isLoading}
			onSubmit={handleSubmit}
		/>
	);
}

export default SigninPage;
