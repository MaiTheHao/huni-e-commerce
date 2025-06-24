import mongoose from 'mongoose';

export interface IBlacklistTokenBase {
	jti: string;
	userId: mongoose.Types.ObjectId;
	tokenType: 'refresh' | 'access';
	issuedAt: Date;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface IBlacklistToken extends IBlacklistTokenBase {
	_id: string;
}

export interface IBlacklistTokenDocument extends IBlacklistTokenBase, mongoose.Document<mongoose.Types.ObjectId> {}
