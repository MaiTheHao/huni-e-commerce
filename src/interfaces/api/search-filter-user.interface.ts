import { IUser, TUserFilterCriteria, TUserSortCriteria } from '../entity/user.entity';
import { IPagination } from '../ui';

export interface ISearchFilterUserRequest {
	page: number;
	limit: number;
	keyword: string;
	criteria: TUserFilterCriteria;
	sort?: TUserSortCriteria;
}

export interface ISearchFilterUsersResponse {
	users: IUser[];
	pagination: IPagination;
	message: string;
}
