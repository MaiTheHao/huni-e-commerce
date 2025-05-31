import { keyboardRepository } from '@/server/repositories/keyboard.repository';
import { toNumber } from '@/util/cast-type.util';
import { NextRequest } from 'next/server';
import { responseService } from '@/server/services/response.service';

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const page = toNumber(searchParams.get('page'), 1);
	const limit = toNumber(searchParams.get('limit'), 1000);

	const { data, pagination } = await keyboardRepository.findWithPagination(page, limit);
	return responseService.success({
		message: 'Lấy danh sách bàn phím thành công',
		data: {
			keyboards: data,
			pagination,
		},
	});
}
