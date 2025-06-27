import { NotificationPage } from '@/components/ui/notification-page/NotificationPage';

export default function EmailVerificationErrorPage() {
	return (
		<NotificationPage
			type='SUCCESS'
			title='Email đã được xác thực!'
			content='Địa chỉ email của bạn đã được xác thực. Bạn sẽ được chuyển đến trang đăng nhập.'
			cta={{
				text: 'Đến trang đăng nhập',
				href: '/signin',
			}}
		/>
	);
}
