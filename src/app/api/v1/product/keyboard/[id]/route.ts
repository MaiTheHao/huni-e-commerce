import { NextRequest } from 'next/server';
import { keyboardRepository } from '@/server/repositories';
import { responseService } from '@/services/response.service';

export async function GET(req: NextRequest) {
	const id = req.nextUrl.pathname.split('/').pop();

	if (!id) {
		return responseService.badRequest('Missing keyboard ID');
	}

	try {
		const keyboard = await keyboardRepository.findById(id);
		if (!keyboard) {
			return responseService.notFound('Keyboard not found');
		}
		return responseService.success(keyboard);
	} catch (error) {
		return responseService.error('Failed to get keyboard information', undefined, error);
	}
}
