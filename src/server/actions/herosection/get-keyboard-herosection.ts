'use server';
import { IHeroSection } from '@/interfaces';
import { heroSectionRepository } from '@/server/repositories';
import { loggerService } from '@/services/logger.service';
import { convertDocumentsToObjects } from '@/util/convert';

export async function getKeyboardHeroSection(page: number = 1, limit: number = 1000) {
	let herosections: IHeroSection[] = [];
	try {
		const response = await heroSectionRepository.findByCategory('keyboard', page, limit);
		const { data } = response;
		if (data && data.length > 0) {
			herosections = convertDocumentsToObjects(data);
		}
	} catch (error) {
		loggerService.error('Lỗi khi lấy danh sách hero section bàn phím', error);
	}
	return herosections;
}
