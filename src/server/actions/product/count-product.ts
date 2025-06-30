'use server';
import { productService } from '@/services/product.service';
import { loggerService } from '@/services/logger.service';
import { TErrorFirst } from '@/interfaces';

/**
 * Đếm số lượng sản phẩm trong cơ sở dữ liệu.
 * @returns {Promise<TErrorFirst<any, number>>} Trả về một Promise chứa kết quả đếm hoặc lỗi.
 */
export async function countProduct(): Promise<TErrorFirst<any, number>> {
	try {
		const [error, count] = await productService.count();
		if (error) throw error;
		return [null, count];
	} catch (error) {
		loggerService.error('Lỗi khi đếm số lượng sản phẩm', error);
		return [error, null];
	}
}
