import { IBlacklistTokenBase } from '@/interfaces';
import mongoose from 'mongoose';

const BlacklistTokenSchema = new mongoose.Schema<IBlacklistTokenBase>(
	{
		jti: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
			index: true,
		},
		tokenType: {
			type: String,
			enum: ['refresh', 'access'],
			required: true,
			index: true,
		},
		issuedAt: {
			type: Date,
			required: true,
			index: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			index: { expireAfterSeconds: 0 },
		},
	},
	{
		timestamps: true,
	}
);

BlacklistTokenSchema.index({ jti: 1, expiresAt: 1 });
BlacklistTokenSchema.index({ userId: 1, tokenType: 1, createdAt: -1 });
BlacklistTokenSchema.index({ userId: 1, issuedAt: -1 });

export const BlacklistTokenModel = mongoose.models.BlacklistToken || mongoose.model('BlacklistToken', BlacklistTokenSchema);
