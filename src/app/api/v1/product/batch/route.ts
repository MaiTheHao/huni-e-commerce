import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { responseService } from '@/services/response.service';
import { IProduct } from '@/interfaces';

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { ids } = body;
	if (!ids || !Array.isArray(ids) || ids.length === 0) {
		return responseService.badRequest('Không tìm thấy ID sản phẩm');
	}

	try {
		const products = await Promise.all(
			ids.map(async (id) => {
				return await productService.findProductById<IProduct>(id);
			})
		);

		const validProducts = products
			.filter(([error, product]) => {
				if (error) {
					return false;
				}
				return product !== null;
			})
			.map(([_, product]) => product);
		return responseService.success(validProducts, 'Lấy thông tin sản phẩm thành công');
	} catch (error) {
		return responseService.error('Không thể lấy thông tin sản phẩm');
	}
}
