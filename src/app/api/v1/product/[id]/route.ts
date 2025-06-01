import { NextRequest } from 'next/server';
import { productCRUDService } from '@/services/product.service';
import { responseService } from '@/services/response.service';
import { loggerService } from '@/services/logger.service';
import { IProduct } from '@/interfaces';

export async function GET(req: NextRequest) {
	const id = req.nextUrl.pathname.split('/').pop();

	if (!id) {
		loggerService.warning('Thiếu mã sản phẩm trong yêu cầu');
		return responseService.badRequest('Thiếu mã sản phẩm');
	}

	try {
		loggerService.info(`Bắt đầu tìm sản phẩm với ID: ${id}`);

		const product = await productCRUDService.findProductById<IProduct>(id);

		if (!product) {
			loggerService.warning(`Không tìm thấy sản phẩm với ID: ${id}`);
			return responseService.notFound('Không tìm thấy sản phẩm');
		}

		loggerService.success(`Lấy thông tin sản phẩm thành công với ID: ${id}`);
		return responseService.success(product);
	} catch (error) {
		loggerService.error(`Lấy thông tin sản phẩm thất bại với ID: ${id}`, error);
		return responseService.error('Lấy thông tin sản phẩm thất bại', undefined, error);
	}
}
