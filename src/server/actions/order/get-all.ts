'use server';
import { orderService } from '@/services/entity/order.service';
import { loggerService } from '@/services/logger.service';
import { IOrder, TErrorFirst } from '@/interfaces';
import { convertDocumentToObject } from '@/util/convert/convert-document-to-object.util';

export async function getAllOrders(filter: Record<string, any> = {}, sort: Record<string, any> = {}): Promise<TErrorFirst<any, IOrder[]>> {
	try {
		const [error, orders] = await orderService.getAll(filter, undefined, sort);
		if (error) {
			loggerService.error('Lỗi khi lấy danh sách đơn hàng:', error);
			return [error, []];
		}
		const result = (orders ?? []).map((order) => convertDocumentToObject<IOrder>(order));
		return [null, result];
	} catch (err) {
		loggerService.error('Lỗi không xác định khi lấy danh sách đơn hàng:', err);
		return ['Đã xảy ra lỗi không xác định', []];
	}
}
