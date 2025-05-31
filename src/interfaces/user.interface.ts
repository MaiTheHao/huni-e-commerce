import mongoose from 'mongoose';

export interface IUser {
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

export interface IUserDocument extends IUser, mongoose.Document<mongoose.Types.ObjectId> {}
