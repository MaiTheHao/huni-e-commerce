import { IOAuthProvider } from '@/interfaces/entity/oauth-provider.interface';
import mongoose from 'mongoose';

export const OAuthProviderSchema = new mongoose.Schema<IOAuthProvider>(
	{
		providerName: { type: String, required: true },
		providerId: { type: String, required: true },
	},
	{
		_id: false, // Không tạo trường _id cho từng provider
		timestamps: false, // Tự động thêm createdAt và updatedAt
	}
);
