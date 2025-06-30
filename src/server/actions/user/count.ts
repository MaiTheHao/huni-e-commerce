'use server';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { TErrorFirst } from '@/interfaces';

export async function countUsers(filter?: Record<string, any>): Promise<TErrorFirst<any, number>> {
	try {
		// Nếu userService chưa có hàm count, bạn cần bổ sung vào userService
		const total = await userService.count?.(filter);
		if (typeof total === 'number') {
			return [null, total];
		}
		// Nếu userService.count trả về [err, data] dạng TErrorFirst
		if (Array.isArray(total)) {
			return total;
		}
		return ['Không thể đếm số lượng người dùng', 0];
	} catch (err) {
		loggerService.error('Lỗi khi đếm số lượng người dùng:', err);
		return ['Đã xảy ra lỗi khi đếm số lượng người dùng', 0];
	}
}
