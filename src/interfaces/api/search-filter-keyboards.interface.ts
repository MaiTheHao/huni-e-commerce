import { IKeyboard, KeyboardFilterCriteria, KeyboardSearchCriteria, KeyboardSortCriteria } from '../keyboard.interface';
import { IPagination } from '../pagination.interface';

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
