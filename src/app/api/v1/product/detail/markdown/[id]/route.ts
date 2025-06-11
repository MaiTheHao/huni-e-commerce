import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';
import { productDetailMarkdownRepository } from '@/server/repositories';

export async function GET(req: NextRequest) {
	const productId = req.nextUrl.pathname.split('/').pop();

	if (!productId) {
		return responseService.badRequest('Missing product ID');
	}

	try {
		const markdown = await productDetailMarkdownRepository.findOne({ productId });
		if (!markdown) {
			return responseService.error('Markdown information not found');
		}
		return responseService.success(markdown);
	} catch (error) {
		return responseService.error('Failed to retrieve markdown information', undefined, error);
	}
}
