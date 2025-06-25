import { NotificationPage } from '@/components/ui/notification-page/NotificationPage';

export default function EmailVerificationSuccessPage() {
	return (
		<NotificationPage
			type='SUCCESS'
			title='Xác minh email thành công!'
			content='Địa chỉ email của bạn đã được xác minh thành công. Bạn có thể đăng nhập và sử dụng các tính năng của hệ thống.'
			cta={{
				text: 'Đăng nhập ngay',
				href: '/signin',
			}}
		/>
	);
}
