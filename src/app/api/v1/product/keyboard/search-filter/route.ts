import { keyboardRepository } from '@/server/repositories/keyboard.repository';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';
import {
	ISearchFilterKeyboardRequest,
	ISearchFilterKeyboardsResponse,
} from '@/interfaces/api/search-filter-keyboards.interface';

export async function POST(req: NextRequest) {
	try {
		const body = (await req.json()) as ISearchFilterKeyboardRequest;
		loggerService.info('Tiến hành tìm kiếm và lọc bàn phím');

		let aborted = false;
		const abortHandler = () => {
			aborted = true;
			loggerService.warning('Request bị abort từ phía client');
		};

		req.signal.addEventListener('abort', abortHandler);

		try {
			if (aborted || req.signal.aborted) {
				return responseService.error('Yêu cầu đã bị hủy', 499);
			}

			const { data, pagination } = await keyboardRepository.searchFilter(
				body.keyword,
				body.criteria,
				body.page,
				body.limit,
				body.sort
			);

			if (aborted || req.signal.aborted) {
				return responseService.error('Yêu cầu đã bị hủy', 499);
			}

			loggerService.info(
				`Tìm kiếm và lọc bàn phím thành công: keyword=${body.keyword}, criteria=${JSON.stringify(
					body.criteria
				)}, page=${body.page}, limit=${body.limit}, sort=${JSON.stringify(body.sort)}`
			);

			const response: ISearchFilterKeyboardsResponse = {
				keyboards: data as any,
				pagination: pagination,
				message: 'Tìm kiếm và lọc bàn phím thành công',
			};

			return responseService.success(response, response.message);
		} catch (error) {
			if (aborted || req.signal.aborted) {
				loggerService.warning('Lỗi do request bị abort');
				return responseService.error('Yêu cầu đã bị hủy', 499);
			}
			loggerService.error('Lỗi khi tìm kiếm và lọc bàn phím:', error);
			return responseService.error('Lỗi khi tìm kiếm và lọc bàn phím', 500);
		} finally {
			req.signal.removeEventListener('abort', abortHandler);
		}
	} catch (err) {
		loggerService.error('Lỗi khi xử lý yêu cầu');
		return responseService.error('Lỗi khi xử lý yêu cầu', 500);
	}
}
