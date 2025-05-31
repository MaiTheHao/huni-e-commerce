import mongoose from 'mongoose';
import { UUIDTypes } from 'uuid';

export type ITokenId = UUIDTypes;

export interface IEmailVerifyToken {
	email: string;
	token: string;
	revoked: Boolean;
	exp: Date;
	createdAt: Date;
	updatedAt: Date;
}
export interface IEmailVerifyTokenDocument extends IEmailVerifyToken, mongoose.Document<mongoose.Types.ObjectId> {}

export interface IRefreshToken {
	uid: mongoose.Types.ObjectId;
	tokenId: String;
	revoked: Boolean;
	exp: Date;
	createdAt: Date;
	updatedAt: Date;
}
export interface IRefreshTokenDocument extends IRefreshToken, mongoose.Document<mongoose.Types.ObjectId> {}
