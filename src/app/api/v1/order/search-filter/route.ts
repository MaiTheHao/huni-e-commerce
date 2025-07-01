import { orderRepository } from '@/server/repositories/order.repository';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';
import { ISearchFilterOrderRequest, ISearchFilterOrdersResponse } from '@/interfaces/api/search-filter-orders.interface';
import { loggerService } from '@/services/logger.service';
import { authService } from '@/services/auth/auth.service';

export async function POST(req: NextRequest) {
	const [authError] = await authService.validAdmin(req);
	if (authError) {
		return responseService.error('Bạn không có quyền truy cập', 403);
	}

	try {
		const body = (await req.json()) as ISearchFilterOrderRequest;

		try {
			const { data, pagination } = await orderRepository.searchFilter(body.keyword, body.criteria, body.page, body.limit, body.sort);

			const response: ISearchFilterOrdersResponse = {
				orders: data as any,
				pagination,
				message: 'Tìm kiếm và lọc đơn hàng thành công',
			};

			return responseService.success(response, response.message);
		} catch (error: any) {
			if (error?.name === 'AbortError' || req.signal.aborted) {
				return responseService.error('Yêu cầu đã bị hủy', 499);
			}
			loggerService.error('Lỗi khi tìm kiếm và lọc đơn hàng', error);
			return responseService.error('Lỗi khi tìm kiếm và lọc đơn hàng', 500);
		}
	} catch (error) {
		loggerService.error('Lỗi khi xử lý yêu cầu tìm kiếm/lọc đơn hàng', error);
		return responseService.error('Lỗi khi xử lý yêu cầu', 500);
	}
}
