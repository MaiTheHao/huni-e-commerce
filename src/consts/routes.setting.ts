import path from 'path';
import { AppRoute } from '../interfaces';
import { faHeadphones, faHouse, faKeyboard } from '@fortawesome/free-solid-svg-icons';

export const ROUTES: { [key: string]: AppRoute } = {
	home: {
		path: '/home',
		title: 'Trang chủ',
		icon: faHouse,
	},
	login: {
		path: '/login',
		title: 'Đăng nhập',
	},
	register: {
		path: '/register',
		title: 'Đăng ký',
	},
	keyboard: {
		path: '/keyboard',
		title: 'Bàn phím',
		icon: faKeyboard,
	},
	keycap: {
		path: '/keycap',
		title: 'Keycaps',
	},
	switches: {
		path: '/switches',
		title: 'Switches',
	},
	contact: {
		path: '/contact',
		title: 'Liên hệ',
		icon: faHeadphones,
	},
	checkout: {
		path: '/checkout',
		title: 'Thanh toán',
	},
	policy: {
		path: '/policy',
		title: 'Chính sách',
	},
	securityPolicy: {
		path: '/security-policy',
		title: 'Chính sách bảo mật',
	},
	termsOfService: {
		path: '/terms-of-service',
		title: 'Điều khoản dịch vụ',
	},
	shippingPolicy: {
		path: '/shipping-policy',
		title: 'Chính sách vận chuyển',
	},
};

export const NAVBAR_ROUTES: AppRoute[] = [ROUTES.home, ROUTES.keyboard, ROUTES.contact];

export const FOOTER_ROUTES_GROUPED = {
	direction: [...NAVBAR_ROUTES],
	policy: [ROUTES.policy, ROUTES.securityPolicy, ROUTES.termsOfService, ROUTES.shippingPolicy],
};
