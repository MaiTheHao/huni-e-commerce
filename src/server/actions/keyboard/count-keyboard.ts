'use server';
import { keyboardRepository } from '@/server/repositories';
import { loggerService } from '@/services/logger.service';

export async function countKeyboard() {
	try {
		return await keyboardRepository.count();
	} catch (error) {
		loggerService.error('Lỗi khi đếm số lượng bàn phím', error);
		throw error;
	}
}
