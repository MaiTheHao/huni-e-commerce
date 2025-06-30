import { keyboardRepository } from '@/server/repositories';
import { toNumber } from '@/util/convert';
import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';
import { IKeyboardDocument, IPagination } from '@/interfaces';

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const page = toNumber(searchParams.get('page'), 1);
	const limit = toNumber(searchParams.get('limit'), 1000);

	const {
		data,
		pagination,
	}: {
		data: IKeyboardDocument[];
		pagination: IPagination;
	} = await keyboardRepository.findWithPagination(page, limit);
	return responseService.success(
		{
			keyboards: data,
			pagination,
		},
		'Lấy tất cả bàn phím thành công'
	);
}
