'use client';
import styles from './VerifyEmail.module.scss';
import AppBody from '@/components/layout/app-body/AppBody';
import AuthForm from '@/components/ui/auth-form/AuthForm';
import { LOCAL_STORAGE_KEYS } from '@/consts/keys';
import { emailSchema } from '@/util/validate-input.util';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { z } from 'zod';

const verifyEmailSchema = z.object({
	email: emailSchema,
});

const delayTime = 1 * 60 * 1000;
function VerifyEmailPage() {
	const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<number>(0);

	// Kiểm tra thời gian đếm ngược đã lưu trong localStorage
	useLayoutEffect(() => {
		const storedIat = localStorage.getItem(LOCAL_STORAGE_KEYS.VERIFY_EMAIL_COUNTDOWN);
		if (storedIat) {
			const iat = parseInt(storedIat, 10);
			const now = Date.now();
			const remainingTime = Math.max(0, Math.floor((iat + delayTime - now) / 1000));

			if (remainingTime > 0) {
				setCountdown(remainingTime);
				setSubmitDisabled(true);
			} else {
				localStorage.removeItem(LOCAL_STORAGE_KEYS.VERIFY_EMAIL_COUNTDOWN);
			}
		}
	}, []);

	const handleSubmit = async (formData: any) => {
		localStorage.setItem(LOCAL_STORAGE_KEYS.VERIFY_EMAIL_COUNTDOWN, Date.now().toString());

		setSubmitDisabled(true);
		setCountdown(delayTime / 1000);
		alert(`Xác thực đã được gửi đến email: ${formData.email}. Vui lòng kiểm tra hộp thư của bạn.`);
	};

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setTimeout(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		} else if (countdown === 0 && submitDisabled) {
			setSubmitDisabled(false);
			localStorage.removeItem(LOCAL_STORAGE_KEYS.VERIFY_EMAIL_COUNTDOWN);
		}

		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [countdown, submitDisabled]);

	return (
		<AppBody sectionClassName={styles.customSection}>
			<AuthForm
				title='Xác thực email'
				subtitle='Nhập email để nhận liên kết xác thực'
				fields={[{ label: 'Email của bạn', name: 'email', placeholder: 'example@gmail.com', required: true }]}
				submitText={countdown > 0 ? `Gửi lại sau ${countdown}s` : `Gửi xác thực`}
				submitDisabled={submitDisabled}
				bottomText={'Bạn đã xác thực thành công ?'}
				bottomLinkText='Đăng nhập ngay'
				bottomLinkHref='/signin'
				validateSchema={verifyEmailSchema}
				onSubmit={handleSubmit}
			/>
		</AppBody>
	);
}

export default VerifyEmailPage;
