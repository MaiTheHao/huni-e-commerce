import { HTTPStatus } from '@/enums/HttpStatus.enum';
import { ICreateOrderRequestData } from '@/interfaces';
import { authService } from '@/services/auth/auth.service';
import { orderService } from '@/services/entity/order.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
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

	try {
		const reqData: ICreateOrderRequestData = await req.json();
		const [createError, order] = await orderService.authedCreate({
			customerId: decoded.uid,
			...reqData,
		});

		if (createError) {
			loggerService.error('Lỗi khi tạo đơn hàng:', createError);
			return responseService.badRequest('Không thể tạo đơn hàng', createError);
		}

		if (order) {
			return responseService.success({}, 'Tạo đơn hàng thành công', HTTPStatus.CREATED);
		}
	} catch (error) {
		loggerService.error('Lỗi trong quá trình xử lý yêu cầu:', error);
		return responseService.internalServerError('Đã xảy ra lỗi trong quá trình xử lý yêu cầu');
	}
}
