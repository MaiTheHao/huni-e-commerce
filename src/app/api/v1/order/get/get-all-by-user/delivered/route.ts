import { orderService } from '@/services/entity/order.service';
import { authService } from '@/services/auth/auth.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const [authError, decoded] = await authService.validUser(req);
	if (authError || !decoded) {
		loggerService.error('Authorization không hợp lệ', authError);
		return responseService.unauthorized('Không được phép truy cập');
	}

	try {
		const customerId = decoded.uid;
		const [getError, orders] = await orderService.getAllByCustomerIdAndStatus(customerId, 'delivered');
		if (getError) {
			loggerService.error('Lỗi khi lấy danh sách đơn hàng:', getError);
			return responseService.badRequest('Không thể lấy danh sách đơn hàng', getError);
		}
		return responseService.success(orders, 'Lấy danh sách đơn hàng thành công');
	} catch (error) {
		loggerService.error('Lỗi trong quá trình xử lý yêu cầu:', error);
		return responseService.internalServerError('Đã xảy ra lỗi trong quá trình xử lý yêu cầu');
	}
}
