import { NextRequest } from 'next/server';
import { productCRUDService } from '@/services/product.service';
import { responseService } from '@/services/response.service';
import { IProduct } from '@/interfaces';

export async function GET(req: NextRequest) {
	const id = req.nextUrl.pathname.split('/').pop();

	if (!id) {
		return responseService.badRequest('Thiếu mã sản phẩm');
	}

	try {
		const product = await productCRUDService.findProductById<IProduct>(id);

		if (!product) {
			return responseService.notFound('Không tìm thấy sản phẩm');
		}
		return responseService.success(product);
	} catch (error) {
		return responseService.error('Lấy thông tin sản phẩm thất bại', undefined, error);
	}
}
