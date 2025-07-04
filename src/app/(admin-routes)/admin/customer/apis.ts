import { ISearchFilterUserRequest, ISearchFilterUsersResponse, IUser, TErrorFirst, TUserSortCriteria } from '@/interfaces';
import api from '@/services/http-client/axios-interceptor';
import Swal from 'sweetalert2';

export async function fetchSearchFilterUsers(
	page: number = 1,
	limit: number = 15,
	filterCriteria: ISearchFilterUserRequest['criteria'],
	sortCriteria: TUserSortCriteria,
	keyword: string,
	signal: AbortSignal
): Promise<TErrorFirst<any, ISearchFilterUsersResponse>> {
	try {
		const response = await api.post(
			'/user/search-filter',
			{
				page,
				limit,
				keyword,
				criteria: filterCriteria,
				sort: sortCriteria,
			} as ISearchFilterUserRequest,
			{
				signal,
			}
		);
		return [null, response.data.data];
	} catch (err: any) {
		return [err?.response?.data || err, null];
	}
}

export async function deleteUser(user: IUser, signal: AbortSignal): Promise<TErrorFirst<any, 'deleted' | 'canceled' | null>> {
	const result = await Swal.fire({
		title: 'Bạn có chắc chắn?',
		text: 'Hành động này không thể hoàn tác.',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Vẫn xóa!',
		cancelButtonText: 'Hủy',
	});
	if (!result.isConfirmed) {
		return [null, 'canceled'];
	}
	try {
		const response = await api.delete('/user', {
			data: { id: user._id },
			signal,
		});
		return [null, 'deleted'];
	} catch (err: any) {
		return [err?.response?.data || err, null];
	}
}
