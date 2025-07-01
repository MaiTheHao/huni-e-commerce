import { ISearchFilterUserRequest, ISearchFilterUsersResponse, TErrorFirst, TUserSortCriteria } from '@/interfaces';
import api from '@/services/http-client/axios-interceptor';

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
