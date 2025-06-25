import { NotificationPage } from '@/components/ui/notification-page/NotificationPage';

export default function ResetPasswordErrorPage() {
	return (
		<NotificationPage
			type='ERROR'
			title='Đặt lại mật khẩu thất bại!'
			content='Đã xảy ra lỗi khi đặt lại mật khẩu của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu sự cố tiếp tục.'
			cta={{
				text: 'Thử lại',
				href: '/reset-password',
			}}
		/>
	);
}
