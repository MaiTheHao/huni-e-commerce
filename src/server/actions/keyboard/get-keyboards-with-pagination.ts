'use server';
import { IKeyboard } from '@/interfaces';
import { loggerService } from '../../../services/logger.service';
import { keyboardRepository } from '../../repositories';
import { convertDocumentsToObjects } from '@/util/convert';

export async function getKeyboardWithPagination(page: number = 1, limit: number = 8): Promise<IKeyboard[]> {
	let keyboards: IKeyboard[] = [];

	try {
		const response = await keyboardRepository.findWithPagination(page, limit);
		const { data } = response;
		if (data) keyboards = convertDocumentsToObjects(data);
	} catch (err) {
		loggerService.error('Lỗi khi lấy danh sách bàn phím với phân trang', err);
	} finally {
		return keyboards;
	}
}
