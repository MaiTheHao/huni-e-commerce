'use server';
import { IProductFilterDocument } from '@/interfaces/product-filter.interface';
import { productFilterRepository } from '@/server/repositories/product-filter.repository';
import { loggerService } from '@/services/logger.service';

export async function getKeyboardFilter(): Promise<IProductFilterDocument | null> {
	loggerService.info('Đang lấy bộ lọc bàn phím từ repository');
	try {
		const data = await productFilterRepository.findByProductType('keyboard');
		if (data) {
			loggerService.success('Lấy bộ lọc bàn phím thành công');
		} else {
			loggerService.warning('Không tìm thấy bộ lọc bàn phím');
		}
		return data;
	} catch (error) {
		loggerService.error('Lỗi khi lấy bộ lọc bàn phím', error);
		return null;
	}
}
