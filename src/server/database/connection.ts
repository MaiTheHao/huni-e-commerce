// lib/database/connection.ts
import mongoose from 'mongoose';
import { loggerService } from '../services/logger.service';

interface ConnectionObject {
	isConnected?: number;
}

const connection: ConnectionObject = {};

export async function connectToDatabase(): Promise<void> {
	if (connection.isConnected) {
		loggerService.info('Đã kết nối với cơ sở dữ liệu');
		return;
	}

	try {
		loggerService.info('Đang kết nối với MongoDB...');
		const isDevelopment = process.env.NODE_ENV === 'development';
		const dbUri = isDevelopment
			? 'mongodb://localhost:27017/ekeyboard'
			: process.env.MONGODB_URI_PROD || 'mongodb://localhost:27017/ekeyboard';
		const db = await mongoose.connect(dbUri);

		connection.isConnected = db.connections[0].readyState;
		loggerService.success('Kết nối MongoDB thành công');
	} catch (error) {
		loggerService.error('Kết nối cơ sở dữ liệu thất bại:', error);
		throw error;
	}
}

export async function disconnectFromDatabase(): Promise<void> {
	if (connection.isConnected) {
		await mongoose.disconnect();
		connection.isConnected = 0;
		loggerService.info('Đã ngắt kết nối MongoDB');
	}
}
