'use server';

import { IKeyboard } from '@/interfaces';
import { loggerService } from '../../../services/logger.service';
import { keyboardRepository } from '../../repositories/keyboard.repository';
import { convertDocumentsToObjects } from '@/util/convertDocumentToObject';

export async function getKeyboardWithPagination(page: number = 1, limit: number = 8): Promise<IKeyboard[]> {
	let keyboards: IKeyboard[] = [];

	try {
		const response = await keyboardRepository.findWithPagination(page, limit);
		const { data, pagination } = response;
		if (data) {
			keyboards = convertDocumentsToObjects(data);
			loggerService.info(
				`Lấy danh sách bàn phím với phân trang thành công: page=${page}, limit=${limit}, total=${keyboards.length}`
			);
		} else {
			loggerService.warning(`Không tìm thấy bàn phím nào với phân trang: page=${page}, limit=${limit}, total=0`);
		}
	} catch (err) {
		loggerService.error('Lỗi khi lấy danh sách bàn phím với phân trang', err);
	} finally {
		return keyboards;
	}
}
