import { toNumber } from '@/util/convert';
import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';
import { globalSearchService } from '@/services/global-search.service';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const keyword = searchParams.get('keyword') || '';

	if (!keyword) {
		return responseService.badRequest('Missing search keyword');
	}

	const limit = toNumber(searchParams.get('limit'), 10);
	const page = toNumber(searchParams.get('page'), 1);

	if (limit < 1 || page < 1) {
		return responseService.badRequest('Limit and page values must be greater than 0');
	}

	try {
		const results = await globalSearchService.searchProducts(keyword, page, limit, undefined, {
			name: 1,
			price: 1,
			discountPercent: 1,
			category: 1,
			brand: 1,
			images: 1,
			description: 1,
			productType: 1,
		});
		return responseService.success(results, 'Product search successful');
	} catch (error) {
		return responseService.error('Product search failed', undefined, error);
	}
}
