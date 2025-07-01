import { userRepository } from '@/server/repositories/user.repository';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';
import { loggerService } from '@/services/logger.service';
import { authService } from '@/services/auth/auth.service';
import { ISearchFilterUserRequest, ISearchFilterUsersResponse } from '@/interfaces/api/search-filter-user.interface';

export async function POST(req: NextRequest) {
	const [authError] = await authService.validAdmin(req);
	if (authError) {
		return responseService.error('Bạn không có quyền truy cập', 403);
	}

	try {
		const body = (await req.json()) as ISearchFilterUserRequest;

		try {
			const { data, pagination } = await userRepository.searchFilter(body.keyword, body.criteria, body.page, body.limit, body.sort);

			const response: ISearchFilterUsersResponse = {
				users: data as any,
				pagination,
				message: 'Tìm kiếm và lọc người dùng thành công',
			};

			return responseService.success(response, response.message);
		} catch (error: any) {
			if (error?.name === 'AbortError' || req.signal.aborted) {
				return responseService.error('Yêu cầu đã bị hủy', 499);
			}
			loggerService.error('Lỗi khi tìm kiếm và lọc người dùng', error);
			return responseService.error('Lỗi khi tìm kiếm và lọc người dùng', 500);
		}
	} catch (error) {
		loggerService.error('Lỗi khi xử lý yêu cầu tìm kiếm/lọc người dùng', error);
		return responseService.error('Lỗi khi xử lý yêu cầu', 500);
	}
}
