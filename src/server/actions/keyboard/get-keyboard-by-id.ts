'use server';
import { IKeyboard } from '@/interfaces';
import { loggerService } from '../../../services/logger.service';
import { keyboardRepository } from '../../repositories';
import { convertDocumentToObject } from '@/util/convert';

export async function getKeyboardById(id: string): Promise<IKeyboard | null> {
	let keyboard: IKeyboard | null = null;

	try {
		const response = await keyboardRepository.findById(id);
		if (response) keyboard = convertDocumentToObject(response);
	} catch (error) {
		loggerService.error(`Lỗi khi lấy bàn phím với ID: ${id}`, error);
	} finally {
		return keyboard;
	}
}
