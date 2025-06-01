import { keyboardRepository } from '@/server/repositories/keyboard.repository';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();
	loggerService.info('Tiến hành tìm kiếm và lọc bàn phím');

	const { data, pagination } = await keyboardRepository.searchFilter(
		body.keyword,
		body.criteria,
		body.page,
		body.limit,
		body.sort
	);

	loggerService.info(
		`Tìm kiếm và lọc bàn phím thành công: keyword=${body.keyword}, criteria=${JSON.stringify(
			body.criteria
		)}, page=${body.page}, limit=${body.limit}, sort=${JSON.stringify(body.sort)}`
	);

	return responseService.success(
		{
			keyboards: data,
			pagination: pagination,
		},
		'Tìm kiếm và lọc bàn phím thành công'
	);
}
