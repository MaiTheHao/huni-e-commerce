'use server';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { IUser, TErrorFirst } from '@/interfaces';
import { convertDocumentsToObjects } from '@/util/convert/convert-document-to-object.util';

export async function getPotentialCustomers(limit: number = 10): Promise<TErrorFirst<any, IUser[]>> {
	try {
		const [error, users] = await userService.getPotentialCustomers(limit);
		if (error) {
			loggerService.error('Lỗi khi lấy danh sách khách hàng tiềm năng:', error);
			return [error, []];
		}
		const usersObj = convertDocumentsToObjects<IUser>(users!);
		return [null, usersObj];
	} catch (err) {
		loggerService.error('Lỗi không xác định khi lấy khách hàng tiềm năng:', err);
		return ['Đã xảy ra lỗi không xác định', []];
	}
}
