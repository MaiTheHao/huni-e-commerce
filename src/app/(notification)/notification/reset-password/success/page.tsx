import { NotificationPage } from '@/components/ui/notification-page/NotificationPage';

export default function ResetPasswordSuccessPage() {
	return (
		<NotificationPage
			type='SUCCESS'
			title='Đặt lại mật khẩu thành công!'
			content='Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.'
			cta={{
				text: 'Đăng nhập',
				href: '/signin',
			}}
		/>
	);
}
