import { IKeyboard, TKeyboardFilterCriteria, TKeyboardSearchCriteria, TKeyboardSortCriteria } from '../entity';
import { IPagination } from '../ui';

export interface ISearchFilterKeyboardRequest {
	page: number;
	limit: number;
	keyword: TKeyboardSearchCriteria;
	criteria: TKeyboardFilterCriteria;
	sort?: TKeyboardSortCriteria;
}

export interface ISearchFilterKeyboardsResponse {
	keyboards: IKeyboard[];
	pagination: IPagination;
	message: string;
}
