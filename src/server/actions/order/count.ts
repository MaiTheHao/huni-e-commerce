'use server';
import { orderService } from '@/services/entity/order.service';
import { loggerService } from '@/services/logger.service';
import { TErrorFirst } from '@/interfaces';

export async function countOrders(filter?: Record<string, any>): Promise<TErrorFirst<any, number>> {
	try {
		const [error, total] = await orderService.count(filter);
		if (error) {
			loggerService.error('Lỗi khi đếm số lượng đơn hàng:', error);
			return [error, 0];
		}
		return [null, total!];
	} catch (err) {
		loggerService.error('Lỗi không xác định khi đếm đơn hàng:', err);
		return ['Đã xảy ra lỗi không xác định', 0];
	}
}
