import mongoose from 'mongoose';
import { IOAuthProvider } from './oauth-provider.interface';
import { TFilterCriteria, TSearchCriteria, TSortCriteria } from '../filter';

export const USER_ROLES = ['user', 'admin'] as const;
export type TUserRole = (typeof USER_ROLES)[number];

export interface IUserMetrics {
	totalOrders: number;
	totalAmountSpent: number;
	lastOrderDate: Date | null;
}

export interface IUserBase {
	email: string;
	phone: string;
	password: string;
	name: string;
	avatar: string;
	addresses: string[];
	roles: TUserRole[];
	salt: Buffer;
	isEmailVerified: Boolean;
	oauthProviders: IOAuthProvider[];
	createdAt: Date;
	updatedAt: Date;
	metrics?: IUserMetrics; // thêm metrics, không bắt buộc
}

export interface IUser extends IUserBase {
	_id: string;
}

export interface IUserDocument extends IUserBase, mongoose.Document<mongoose.Types.ObjectId> {}

export const USER_SEARCHABLE_FIELDS = ['_id', 'email', 'phone', 'name', 'avatar'] as const;
export type TUserSearchableFields = (typeof USER_SEARCHABLE_FIELDS)[number];

export const USER_FILTERABLE_FIELDS = ['roles', 'isEmailVerified', 'createdAt'] as const;
export type TUserFilterableFields = (typeof USER_FILTERABLE_FIELDS)[number];

export const USER_SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'name', 'email'] as const;
export type TUserSortableFields = (typeof USER_SORTABLE_FIELDS)[number];

export type TUserFilterCriteria = TFilterCriteria<TUserFilterableFields>;
export type TUserSortCriteria = TSortCriteria<TUserSortableFields>;
export type TUserSearchCriteria = TSearchCriteria;
