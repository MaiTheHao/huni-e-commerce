import { NextRequest } from 'next/server';
import { productCRUDService } from '@/services/productCRUD.service';
import { responseService } from '@/services/response.service';
import { IProduct } from '@/interfaces';

export async function GET(req: NextRequest) {
	const id = req.nextUrl.pathname.split('/').pop();

	if (!id) {
		return responseService.badRequest('Không tìm thấy ID sản phẩm');
	}

	try {
		const [error, product] = await productCRUDService.findProductById<IProduct>(id);
		if (error) {
			return responseService.error('Không thể lấy thông tin sản phẩm');
		}
		if (!product) {
			return responseService.notFound('Không tìm thấy sản phẩm');
		}
		return responseService.success(product);
	} catch (error) {
		return responseService.error('Không thể lấy thông tin sản phẩm');
	}
}
