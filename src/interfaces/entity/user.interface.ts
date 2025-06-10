import mongoose from 'mongoose';

export interface IUserBase {
	email: string;
	phone: string;
	password: string;
	name: string;
	address?: string;
	roles: string[];
	salt: Buffer;
	isEmailVerified: Boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface IUser extends IUserBase {
	_id: string;
}

export interface IUserDocument extends IUserBase, mongoose.Document<mongoose.Types.ObjectId> {}
