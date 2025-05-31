'use server';

import { IKeyboard } from '@/interfaces';
import mongoose from 'mongoose';
import { loggerService } from '../../services/logger.service';
import { keyboardRepository } from '../../repositories/keyboard.repository';
import { convertDocumentToObject } from '@/util/convertDocumentToObject';

export async function getKeyboardById(id: string): Promise<IKeyboard | null> {
	let keyboard: IKeyboard | null = null;

	try {
		const response = await keyboardRepository.findById(id);
		if (!response) {
			loggerService.warning(`Không tìm thấy bàn phím với ID: ${id}`);
		} else {
			keyboard = convertDocumentToObject(response);
			loggerService.info(`Lấy bàn phím thành công với ID: ${id}`);
		}
	} catch (error) {
		loggerService.error(`Lỗi khi lấy bàn phím với ID: ${id}`, error);
	}

	return keyboard;
}
