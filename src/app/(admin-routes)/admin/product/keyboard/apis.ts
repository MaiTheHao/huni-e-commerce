import { ISearchFilterKeyboardRequest, ISearchFilterKeyboardsResponse, TErrorFirst, TKeyboardSortCriteria } from '@/interfaces';
import api from '@/services/http-client/axios-interceptor';

export async function fetchSearchFilterKeyboards(
	page: number = 1,
	limit: number = 15,
	filterCriteria: ISearchFilterKeyboardRequest['criteria'],
	sortCriteria: TKeyboardSortCriteria,
	keyword: string,
	signal: AbortSignal
): Promise<TErrorFirst<any, ISearchFilterKeyboardsResponse>> {
	try {
		const response = await api.post(
			'/product/keyboard/search-filter',
			{
				page,
				limit,
				keyword,
				criteria: filterCriteria,
				sort: sortCriteria,
			} as ISearchFilterKeyboardRequest,
			{
				signal,
			}
		);
		return [null, response.data.data];
	} catch (err: any) {
		return [err?.response?.data || err, null];
	}
}
