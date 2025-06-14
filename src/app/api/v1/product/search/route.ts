import { toNumber } from '@/util/convert';
import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';
import { globalSearchService } from '@/services/global-search.service';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const keyword = searchParams.get('keyword') || '';

	if (!keyword) {
		return responseService.badRequest('Thiếu từ khóa tìm kiếm');
	}

	const limit = toNumber(searchParams.get('limit'), 10);
	const page = toNumber(searchParams.get('page'), 1);

	if (limit < 1 || page < 1) {
		return responseService.badRequest('Giá trị limit và page phải lớn hơn 0');
	}

	try {
		const [error, results] = await globalSearchService.searchProducts(keyword, page, limit, undefined, {
			name: 1,
			price: 1,
			discountPercent: 1,
			category: 1,
			brand: 1,
			images: 1,
			description: 1,
			productType: 1,
		});
		if (error) {
			return responseService.error('Tìm kiếm sản phẩm thất bại', undefined, error);
		}
		return responseService.success(results, 'Tìm kiếm sản phẩm thành công');
	} catch (error) {
		return responseService.error('Tìm kiếm sản phẩm thất bại', undefined, error);
	}
}
