import { HTTPStatus } from '@/enums/HttpStatus.enum';
import { ICreateOrderRequestData } from '@/interfaces';
import { orderService } from '@/services/entity/order.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const reqData: ICreateOrderRequestData = await req.json();
		const [createError, order] = await orderService.anonymousCreate(reqData);

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
