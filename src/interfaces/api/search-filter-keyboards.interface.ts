import { IKeyboard, KeyboardFilterCriteria, KeyboardSearchCriteria, KeyboardSortCriteria } from '../entity';
import { IPagination } from '../ui';

export interface ISearchFilterKeyboardRequest {
	page: number;
	limit: number;
	keyword: KeyboardSearchCriteria;
	criteria: KeyboardFilterCriteria;
	sort?: KeyboardSortCriteria;
}

export interface ISearchFilterKeyboardsResponse {
	keyboards: IKeyboard[];
	pagination: IPagination;
	message: string;
}
