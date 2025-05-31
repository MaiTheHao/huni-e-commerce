import { IUser } from '@/interfaces';
import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema<Omit<IUser, '_id'>>({
	email: { type: String, required: true, unique: true },
	phone: { type: String, unique: true },
	name: { type: String, required: true },
	salt: { type: Buffer, required: true },
	password: { type: String, required: true },
	address: { type: String },
	roles: { type: [String], default: ['user'] },
	isEmailVerified: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
