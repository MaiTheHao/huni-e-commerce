// import { IEmailVerifyToken } from '@/interfaces';
// import mongoose from 'mongoose';

// export const EmailVerifyTokenSchema = new mongoose.Schema<Omit<IEmailVerifyToken, '_id'>>({
// 	email: { type: String, unique: true, required: true },
// 	token: { type: String, required: true },
// 	revoked: { type: Boolean, default: false },
// 	exp: { type: Date, required: true },
// 	createdAt: { type: Date, default: Date.now() },
// 	updatedAt: { type: Date, default: Date.now() },
// });

// export const EmailVerifyTokenModel =
// 	mongoose.models.EmailVerifyToken || mongoose.model('EmailVerifyToken', EmailVerifyTokenSchema);
