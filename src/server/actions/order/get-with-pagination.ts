'use server';
import { orderService } from '@/services/entity/order.service';
import { loggerService } from '@/services/logger.service';
import { IOrder, IPagination, TErrorFirst } from '@/interfaces';
import { convertDocumentsToObjects } from '@/util/convert/convert-document-to-object.util';

export async function getOrdersWithPagination(
	page: number = 1,
	limit: number = 10,
	filter: Record<string, any> = {},
	sort: Record<string, any> = {}
): Promise<TErrorFirst<any, { data: IOrder[]; pagination: IPagination }>> {
	try {
		const [error, result] = await orderService.getAllWithPagination(page, limit, filter, sort);
		if (error) {
			loggerService.error('Lỗi khi lấy danh sách đơn hàng phân trang:', error);
			return [error, null];
		}
		const orders = convertDocumentsToObjects<IOrder>(result!.data);
		return [null, { data: orders, pagination: result!.pagination }];
	} catch (err) {
		loggerService.error('Lỗi không xác định khi lấy đơn hàng phân trang:', err);
		return ['Đã xảy ra lỗi không xác định', null];
	}
}
