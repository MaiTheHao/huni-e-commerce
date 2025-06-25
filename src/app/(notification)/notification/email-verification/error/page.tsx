import { NotificationPage } from '@/components/ui/notification-page/NotificationPage';

export default function EmailVerificationErrorPage() {
	return (
		<NotificationPage
			type='ERROR'
			title='Xác minh email thất bại!'
			content='Đã xảy ra lỗi khi xác minh địa chỉ email của bạn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu sự cố tiếp tục.'
			cta={{
				text: 'Thử lại',
				href: '/verify-email',
			}}
		/>
	);
}
