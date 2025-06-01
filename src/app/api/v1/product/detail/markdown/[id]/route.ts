import { NextRequest } from 'next/server';
import { responseService } from '@/server/services/response.service';
import { productDetailMarkdownRepository } from '@/server/repositories/product-detail-markdown.repository';

export async function GET(req: NextRequest) {
	const productId = req.nextUrl.pathname.split('/').pop();

	if (!productId) {
		return responseService.badRequest('Thiếu mã sản phẩm');
	}

	try {
		const markdown = await productDetailMarkdownRepository.findOne({ productId });
		if (!markdown) {
			return responseService.error('Không tìm thấy thông tin markdown');
		}
		return responseService.success(markdown);
	} catch (error) {
		return responseService.error('Lấy thông tin markdown thất bại', undefined, error);
	}
}
