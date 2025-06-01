'use server';

import { IHeroSection } from '@/interfaces';
import { heroSectionRepository } from '@/server/repositories/hero-section.repository';
import { convertDocumentsToObjects } from '@/util/convertDocumentToObject';
import { loggerService } from '@/services/logger.service';

export async function getKeyboardHeroSection(page: number = 1, limit: number = 1000) {
	let herosections: IHeroSection[] = [];
	try {
		const response = await heroSectionRepository.findByCategory('keyboard', page, limit);
		const { data, pagination } = response;
		if (data && data.length > 0) {
			herosections = convertDocumentsToObjects(data);
			loggerService.info(
				`Lấy danh sách hero section bàn phím thành công: page=${page}, limit=${limit}, total=${herosections.length}`
			);
		} else {
			loggerService.warning(`Không tìm thấy hero section bàn phím nào: page=${page}, limit=${limit}, total=0`);
		}
	} catch (error) {
		loggerService.error('Lỗi khi lấy danh sách hero section bàn phím', error);
	}
	return herosections;
}
