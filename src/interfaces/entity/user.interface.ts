import mongoose from 'mongoose';

export const USER_ROLES = ['user', 'admin'] as const;
export type TUserRole = (typeof USER_ROLES)[number];

export interface IUserBase {
	email: string;
	phone: string;
	password: string;
	name: string;
	address?: string;
	roles: TUserRole[];
	salt: Buffer;
	isEmailVerified: Boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUser extends IUserBase {
	_id: string;
}

export interface IUserDocument extends IUserBase, mongoose.Document<mongoose.Types.ObjectId> {}
