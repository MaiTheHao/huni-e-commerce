'use client';
import { useEffect, useState } from 'react';
import { NotificationPage } from '@/components/ui/notification-page/NotificationPage';
import { useAuthContext } from '@/contexts/AuthContext/useAuthContext';
import { COOKIE_KEYS_MAP } from '@/consts/map-value';
import { loggerService } from '@/services/logger.service';

export default function OAuthSuccessPage() {
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const { login } = useAuthContext();

	useEffect(() => {
		const handleOAuthSuccess = async () => {
			try {
				// Đọc access token từ cookie
				const cookies = document.cookie.split(';').reduce((acc, cookie) => {
					const [key, value] = cookie.trim().split('=');
					acc[key] = value;
					return acc;
				}, {} as Record<string, string>);

				const tmpAccessToken = cookies[COOKIE_KEYS_MAP.TMP_ACCESS_TOKEN];

				if (!tmpAccessToken) {
					throw new Error('Không tìm thấy access token từ OAuth');
				}

				// Parse JSON từ cookie
				const accessToken = JSON.parse(decodeURIComponent(tmpAccessToken));

				if (!accessToken) {
					throw new Error('Access token không hợp lệ');
				}

				// Xóa temporary cookie
				document.cookie = `${COOKIE_KEYS_MAP.TMP_ACCESS_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

				// Đăng nhập bằng access token
				login(accessToken);

				// Đợi cho đến khi authentication hoàn tất
				setStatus('success');
			} catch (error) {
				loggerService.error('Lỗi xử lý OAuth success:', error);
				setStatus('error');
			}
		};

		handleOAuthSuccess();
	}, [login]);

	if (status === 'loading') {
		return <NotificationPage type='LOADING' title='Đang xử lý đăng nhập...' content='Vui lòng chờ trong giây lát, chúng tôi đang xử lý thông tin đăng nhập của bạn.' />;
	}

	if (status === 'error') {
		return (
			<NotificationPage
				type='ERROR'
				title='Xác thực không thành công!'
				content={'Không thể xác thực thành công, vui lòng thử lại.'}
				cta={{
					text: 'Quay về trang đăng nhập',
					href: '/signin',
				}}
			/>
		);
	}

	return (
		<NotificationPage
			type='SUCCESS'
			title='Xác thực thành công!'
			content='Bạn đã xác thực thành công, chào mừng bạn đã đăng nhập vào hệ thống.'
			cta={{
				text: 'Đi tới trang chủ',
				href: '/home',
			}}
		/>
	);
}
