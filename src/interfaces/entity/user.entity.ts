import mongoose from 'mongoose';
import { IOAuthProvider } from './oauth-provider.interface';

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
