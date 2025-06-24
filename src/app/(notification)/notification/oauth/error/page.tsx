import { NotificationPage } from '@/components/ui/notification-page/NotificationPage';

export default function OAuthErrorPage() {
	return (
		<NotificationPage
			type='ERROR'
			title='Xác thực không thành công!'
			content='Xác thực thất bại, vui lòng thử lại hoặc sử dụng phương thức đăng nhập khác.'
			cta={{
				text: 'Quay về trang đăng nhập',
				href: '/signin',
			}}
		/>
	);
}
