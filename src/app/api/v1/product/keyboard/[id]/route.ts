import { NextRequest } from 'next/server';
import { keyboardRepository } from '@/server/repositories/keyboard.repository';
import { responseService } from '@/server/services/response.service';

export async function GET(req: NextRequest) {
	const id = req.nextUrl.pathname.split('/').pop();

	if (!id) {
		return responseService.badRequest('Thiếu mã bàn phím');
	}

	try {
		const keyboard = await keyboardRepository.findById(id);
		if (!keyboard) {
			return responseService.notFound('Không tìm thấy bàn phím');
		}
		return responseService.success(keyboard);
	} catch (error) {
		return responseService.error('Lấy thông tin bàn phím thất bại', undefined, error);
	}
}
