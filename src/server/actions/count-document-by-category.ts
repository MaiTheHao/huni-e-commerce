'use server';

import { heroSectionRepository } from '../repositories/hero-section.repository';
import { keyboardRepository } from '../repositories/keyboard.repository';

const MAP_REPOSITORIES_BY_CATEGORY = {
	keyboard: keyboardRepository,
	herosection: heroSectionRepository,
} as const;

export async function countDocumentByCategory(category: keyof typeof MAP_REPOSITORIES_BY_CATEGORY): Promise<number> {
	const repository = MAP_REPOSITORIES_BY_CATEGORY[category];
	if (!repository) {
		throw new Error(`Không tìm thấy kho lưu trữ cho danh mục: ${category}`);
	}

	try {
		const count = await repository.count();
		return count;
	} catch (error) {
		console.error(`Lỗi khi đếm số lượng cho danh mục ${category}:`, error);
		throw error;
	}
}
