import mongoose from 'mongoose';
import { loggerService } from '../../services/logger.service';

interface ConnectionObject {
	isConnected?: number;
}

const connection: ConnectionObject = {};

function getDbContext() {
	return '[MongoDB Connection]';
}

export async function connectToDatabase(): Promise<void> {
	if (connection.isConnected) {
		loggerService.info(`${getDbContext()} Đã kết nối với cơ sở dữ liệu (pass through reconnect)`);
		return;
	}

	try {
		const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
		const dbUri = isDevelopment
			? 'mongodb://localhost:27017/ekeyboard'
			: process.env.MONGODB_URI || 'mongodb://localhost:27017/ekeyboard';

		loggerService.debug(`${getDbContext()} Đang kết nối tới cơ sở dữ liệu...`, {
			env: process.env.NODE_ENV,
			uri: dbUri.replace(/\/\/.*@/, '//****:****@'),
		});

		const db = await mongoose.connect(dbUri);

		connection.isConnected = db.connections[0].readyState;
		loggerService.success(`${getDbContext()} Kết nối MongoDB thành công`);
	} catch (error) {
		loggerService.critical(`${getDbContext()} Kết nối cơ sở dữ liệu thất bại`, error);
		throw error;
	}
}

export async function disconnectFromDatabase(): Promise<void> {
	if (connection.isConnected) {
		loggerService.debug(`${getDbContext()} Đang ngắt kết nối MongoDB...`);
		await mongoose.disconnect();
		connection.isConnected = 0;
		loggerService.info(`${getDbContext()} Đã ngắt kết nối MongoDB`);
	}
}
