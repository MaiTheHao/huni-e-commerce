import { TOrderStatus } from '../interfaces/entity/order/order.entity';

export function getOrderStatusText(status: TOrderStatus): string {
	switch (status) {
		case 'pending':
			return 'Chờ xác nhận';
		case 'confirmed':
			return 'Đã xác nhận';
		case 'shipped':
			return 'Đang giao hàng';
		case 'delivered':
			return 'Đã nhận hàng';
		case 'cancelled':
			return 'Đã hủy';
		default:
			return status;
	}
}
