import { IUserBase, USER_ROLES } from '@/interfaces';
import mongoose from 'mongoose';
import { OAuthProviderSchema } from './sub-schemas/oauth-provider.schema';

const UserSchema = new mongoose.Schema<IUserBase>(
	{
		email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
		phone: { type: String, trim: true },
		salt: { type: Buffer },
		password: { type: String, trim: true },
		name: { type: String, required: true, trim: true },
		avatar: { type: String, default: '', trim: true },
		addresses: { type: [String], default: [], trim: true },
		oauthProviders: [OAuthProviderSchema],
		roles: { type: [String], enum: USER_ROLES, required: true, default: ['user'] },
		isEmailVerified: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

UserSchema.index({ email: 1, isEmailVerified: 1 });
UserSchema.index({ roles: 1, createdAt: -1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ 'oauthProviders.providerName': 1, 'oauthProviders.providerId': 1 });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
