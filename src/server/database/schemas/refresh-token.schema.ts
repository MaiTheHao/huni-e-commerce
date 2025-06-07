// import * as mongoose from 'mongoose';
// import { IRefreshToken } from '@/interfaces';

// export const RefreshTokenSchema = new mongoose.Schema<Omit<IRefreshToken, '_id'>>({
// 	uid: { type: mongoose.Schema.Types.ObjectId, required: true },
// 	tokenId: { type: String, unique: true, required: true },
// 	revoked: { type: Boolean, default: false },
// 	exp: { type: Date, required: true },
// 	createdAt: { type: Date, default: Date.now() },
// 	updatedAt: { type: Date, default: Date.now() },
// });

// export const RefreshTokenModel = mongoose.models.RefreshToken || mongoose.model('RefreshToken', RefreshTokenSchema);
