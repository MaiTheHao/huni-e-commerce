import { IOrder, TOrderFilterCriteria, TOrderSortCriteria } from '../entity/order/order.entity';
import { IPagination } from '../ui';

export interface ISearchFilterOrderRequest {
	page: number;
	limit: number;
	keyword: string;
	criteria: TOrderFilterCriteria;
	sort?: TOrderSortCriteria;
}

export interface ISearchFilterOrdersResponse {
	orders: IOrder[];
	pagination: IPagination;
	message: string;
}
