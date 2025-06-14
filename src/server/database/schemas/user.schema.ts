import { IUserBase, USER_ROLES } from '@/interfaces';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema<IUserBase>({
	email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
	phone: { type: String, trim: true },
	password: { type: String, required: true, trim: true },
	name: { type: String, required: true, trim: true },
	address: { type: String, default: '', trim: true },
	roles: { type: [String], enum: USER_ROLES, required: true, default: ['user'] },
	salt: { type: Buffer, required: true },
	isEmailVerified: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
