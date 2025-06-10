import mongoose from 'mongoose';
import { UUIDTypes } from 'uuid';

export type ITokenId = UUIDTypes;

export interface IEmailVerifyTokenBase {
	email: string;
	token: string;
	revoked: Boolean;
	exp: Date;
	createdAt: Date;
	updatedAt: Date;
}
export interface IEmailVerifyToken extends IEmailVerifyTokenBase {
	_id: string;
}
export interface IEmailVerifyTokenDocument extends IEmailVerifyTokenBase, mongoose.Document<mongoose.Types.ObjectId> {}

export interface IRefreshTokenBase {
	uid: mongoose.Types.ObjectId;
	tokenId: String;
	revoked: Boolean;
	exp: Date;
	createdAt: Date;
	updatedAt: Date;
}
export interface IRefreshToken extends IRefreshTokenBase {
	_id: string;
}
export interface IRefreshTokenDocument extends IRefreshTokenBase, mongoose.Document<mongoose.Types.ObjectId> {}
