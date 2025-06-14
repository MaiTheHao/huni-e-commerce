import { keyboardRepository } from '@/server/repositories';
import { toNumber } from '@/util/convert';
import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const page = toNumber(searchParams.get('page'), 1);
	const limit = toNumber(searchParams.get('limit'), 1000);

	const { data, pagination } = await keyboardRepository.findWithPagination(page, limit);
	return responseService.success(
		{
			keyboards: data,
			pagination,
		},
		'Lấy tất cả bàn phím thành công'
	);
}
