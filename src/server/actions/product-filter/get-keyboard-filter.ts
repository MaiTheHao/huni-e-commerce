'use server';
import { IProductFilter } from '@/interfaces';
import { productFilterRepository } from '@/server/repositories';
import { loggerService } from '@/services/logger.service';
import { convertDocumentToObject } from '@/util/convert';

export async function getKeyboardFilter(): Promise<IProductFilter | null> {
	let data: IProductFilter | null = null;
	try {
		const response = await productFilterRepository.findByProductType('keyboard');
		if (response) data = convertDocumentToObject(response);
	} catch (error) {
		loggerService.error('Lỗi khi lấy bộ lọc bàn phím', error);
		return null;
	} finally {
		return data;
	}
}
