import { orderService } from '@/services/entity/order.service';
import { authService } from '@/services/auth/auth.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
	const [error, token] = authService.extractBearerToken(req);
	if (error || !token) {
		loggerService.error('Authorization không hợp lệ', error);
		return responseService.unauthorized('Không được phép truy cập');
	}

	const [verifyError, decoded] = await tokenService.verifyAccessToken(token);
	if (verifyError || !decoded) {
		loggerService.error(`Xác thực access token thất bại ${verifyError}`);
		return responseService.unauthorized('Không được phép truy cập');
	}

	const orderId = params.id;
	if (!orderId) {
		return responseService.badRequest('Thiếu ID đơn hàng');
	}

	try {
		const [getError, order] = await orderService.getById(orderId);
		if (getError) {
			loggerService.error('Lỗi khi lấy thông tin đơn hàng:', getError);
			return responseService.badRequest('Không thể lấy thông tin đơn hàng', getError);
		}
		// Kiểm tra quyền truy cập: chỉ cho phép chủ đơn hàng xem
		if (order?.customerId?.toString() !== decoded.uid) {
			return responseService.unauthorized('Không được phép truy cập đơn hàng này');
		}
		return responseService.success(order, 'Lấy thông tin đơn hàng thành công');
	} catch (error) {
		loggerService.error('Lỗi trong quá trình xử lý yêu cầu:', error);
		return responseService.internalServerError('Đã xảy ra lỗi trong quá trình xử lý yêu cầu');
	}
}
