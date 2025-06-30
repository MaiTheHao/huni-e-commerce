import { keyboardRepository } from '@/server/repositories';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';
import { ISearchFilterKeyboardRequest, ISearchFilterKeyboardsResponse } from '@/interfaces';
import { loggerService } from '@/services/logger.service';
import { productFilterRepository } from '@/server/repositories';
import { convertDocumentToObject } from '@/util/convert';

export async function GET(req: NextRequest) {
	try {
		const response = await productFilterRepository.findByProductType('keyboard');
		if (!response) {
			return responseService.notFound('Không tìm thấy bộ lọc bàn phím');
		}
		const data = convertDocumentToObject(response);
		return responseService.success(data, 'Lấy bộ lọc bàn phím thành công');
	} catch (error) {
		loggerService.error('Lỗi khi lấy bộ lọc bàn phím', error);
		return responseService.internalServerError('Lỗi khi lấy bộ lọc bàn phím', error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as ISearchFilterKeyboardRequest;

		let aborted = false;
		const abortHandler = () => {
			aborted = true;
		};

		req.signal.addEventListener('abort', abortHandler);

		try {
			if (aborted || req.signal.aborted) {
				return responseService.error('Request has been aborted', 499);
			}

			const { data, pagination } = await keyboardRepository.searchFilter(body.keyword, body.criteria, body.page, body.limit, body.sort);

			if (aborted || req.signal.aborted) {
				return responseService.error('Request has been aborted', 499);
			}
			const response: ISearchFilterKeyboardsResponse = {
				keyboards: data as any,
				pagination: pagination,
				message: 'Search and filter keyboards successfully',
			};

			return responseService.success(response, response.message);
		} catch {
			if (aborted || req.signal.aborted) {
				return responseService.error('Request has been aborted', 499);
			}
			return responseService.error('Error searching and filtering keyboards', 500);
		} finally {
			req.signal.removeEventListener('abort', abortHandler);
		}
	} catch {
		return responseService.error('Error processing request', 500);
	}
}
