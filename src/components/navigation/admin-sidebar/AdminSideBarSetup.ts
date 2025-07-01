import { faHouse, faKeyboard, faTruckRampBox, faUsers } from '@fortawesome/free-solid-svg-icons';

type NavItem = {
	title: string;
	path: string;
	icon: any;
};

type NavSection = {
	title: string;
	items: NavItem[];
};

export const NAV_LIST: NavSection[] = [
	{
		title: 'Tổng quan',
		items: [
			{
				title: 'Bảng điều khiển',
				path: '/admin/dashboard',
				icon: faHouse,
			},
			{
				title: 'Đơn hàng',
				path: '/admin/order',
				icon: faTruckRampBox,
			},
			{
				title: 'Khách hàng',
				path: '/admin/customer',
				icon: faUsers,
			},
		],
	},
	{
		title: 'Sản phẩm',
		items: [
			{
				title: 'Bàn phím',
				path: '/admin/product/keyboard',
				icon: faKeyboard,
			},
		],
	},
	{
		title: 'Báo cáo & Thống kê',
		items: [],
	},
];
