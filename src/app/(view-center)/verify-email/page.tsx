'use client';
import AuthForm from '@/components/ui/auth-form/AuthForm';
import { LOCAL_STORAGE_KEYS_MAP } from '@/consts/map-value';
import { IResponse, TErrorFirst } from '@/interfaces';
import { isEmpty } from '@/util';
import { emailSchema } from '@/util/validate-input.util';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { z } from 'zod';
import Swal from 'sweetalert2';

const fetchVerifyEmail = async (email: string): Promise<TErrorFirst<any, null>> => {
	if (isEmpty(email)) {
		return ['Email là bắt buộc', null];
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		});

		const result: IResponse = await response.json();

		if (!response.ok || result.error) {
			return [result?.message || 'Gửi yêu cầu xác thực email thất bại', null];
		}

		return [null, null];
	} catch (error) {
		return ['Đã xảy ra lỗi khi kết nối đến máy chủ', null];
	}
};

const verifyEmailSchema = z.object({
	email: emailSchema,
});

const delayTime = 1 * 60 * 1000;
function VerifyEmailPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<number>(0);

	useLayoutEffect(() => {
		const storedIat = localStorage.getItem(LOCAL_STORAGE_KEYS_MAP.VERIFY_EMAIL_COUNTDOWN);
		if (storedIat) {
			const iat = parseInt(storedIat, 10);
			const now = Date.now();
			const remainingTime = Math.max(0, Math.floor((iat + delayTime - now) / 1000));

			if (remainingTime > 0) {
				setCountdown(remainingTime);
				setSubmitDisabled(true);
			} else {
				localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.VERIFY_EMAIL_COUNTDOWN);
			}
		}
	}, []);

	const handleSubmit = async (formData: any) => {
		if (isLoading || submitDisabled) return;
		setIsLoading(true);
		localStorage.setItem(LOCAL_STORAGE_KEYS_MAP.VERIFY_EMAIL_COUNTDOWN, Date.now().toString());
		try {
			const [error, result] = await fetchVerifyEmail(formData.email);
			if (error) {
				Swal.fire({
					icon: 'error',
					title: 'Lỗi',
					text: error,
					timer: 2000,
					showConfirmButton: false,
				});
				return;
			}
			if (result === null) {
				Swal.fire({
					icon: 'success',
					title: 'Thành công',
					text: 'Yêu cầu xác thực email đã được gửi thành công. Vui lòng kiểm tra hộp thư đến của bạn.',
					timer: 2000,
					showConfirmButton: false,
				});
			}

			setSubmitDisabled(true);
			setCountdown(delayTime / 1000);
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Lỗi',
				text: 'Đã xảy ra lỗi khi gửi yêu cầu xác thực email. Vui lòng thử lại sau.',
				timer: 2000,
				showConfirmButton: false,
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setTimeout(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		} else if (countdown === 0 && submitDisabled) {
			setSubmitDisabled(false);
			localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.VERIFY_EMAIL_COUNTDOWN);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [countdown, submitDisabled]);

	return (
		<AuthForm
			title='Xác thực email'
			subtitle='Nhập email để nhận liên kết xác thực'
			fields={[{ label: 'Email của bạn', name: 'email', placeholder: 'example@gmail.com', required: true }]}
			submitText={countdown > 0 ? `Gửi lại sau ${countdown}s` : `Gửi xác thực`}
			submitDisabled={submitDisabled}
			isSending={isLoading}
			bottomText={'Bạn đã xác thực thành công ?'}
			bottomLinkText='Đăng nhập ngay'
			bottomLinkHref='/signin'
			validateSchema={verifyEmailSchema}
			onSubmit={handleSubmit}
		/>
	);
}

export default VerifyEmailPage;
