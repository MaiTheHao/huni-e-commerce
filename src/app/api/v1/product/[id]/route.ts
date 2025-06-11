import { NextRequest } from 'next/server';
import { productCRUDService } from '@/services/productCRUD.service';
import { responseService } from '@/services/response.service';
import { IProduct } from '@/interfaces';

export async function GET(req: NextRequest) {
	const id = req.nextUrl.pathname.split('/').pop();

	if (!id) {
		return responseService.badRequest('Missing product ID');
	}

	try {
		const product = await productCRUDService.findProductById<IProduct>(id);

		if (!product) {
			return responseService.notFound('Product not found');
		}
		return responseService.success(product);
	} catch (error) {
		return responseService.error('Failed to get product information', undefined, error);
	}
}
