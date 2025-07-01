import { ISearchFilterOrderRequest, ISearchFilterOrdersResponse, TErrorFirst, TOrderSortCriteria } from '@/interfaces';
import api from '@/services/http-client/axios-interceptor';

export async function fetchSearchFilterOrders(
	page: number = 1,
	limit: number = 15,
	filterCriteria: ISearchFilterOrderRequest['criteria'],
	sortCriteria: TOrderSortCriteria,
	keyword: string,
	signal: AbortSignal
): Promise<TErrorFirst<any, ISearchFilterOrdersResponse>> {
	try {
		const response = await api.post(
			'/order/search-filter',
			{
				page,
				limit,
				keyword,
				criteria: filterCriteria,
				sort: sortCriteria,
			} as ISearchFilterOrderRequest,
			{
				signal,
			}
		);
		return [null, response.data.data];
	} catch (err: any) {
		return [err?.response?.data || err, null];
	}
}
