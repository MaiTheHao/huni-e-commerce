import { IUser, IUserDocument, IUserMetrics, TErrorFirst } from '@/interfaces';
import { userRepository } from '@/server/repositories/user.repository';
import { isEmpty } from '@/util';
import { loggerService } from '../logger.service';

class UserService {
	private static instance: UserService;

	private constructor() {}

	static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	// CREATE METHODS

	async create(userData: Pick<IUser, 'email'> & Partial<Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>>): Promise<TErrorFirst<any, IUserDocument>> {
		if (isEmpty(userData.email)) {
			return ['Email không được để trống', null];
		}

		try {
			const existed = await this.existsByEmail(userData.email);
			if (existed) return ['Người dùng với email này đã tồn tại', null];

			const newUser = await userRepository.create(userData);
			return [null, newUser];
		} catch (error) {
			loggerService.error('Lỗi trong quá trình tạo người dùng:', error);
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo người dùng', null];
		}
	}

	// READ METHODS

	async getById(userId: string, projection?: Record<string, any>): Promise<TErrorFirst<any, IUserDocument | null>> {
		if (isEmpty(userId)) {
			return ['ID người dùng không được để trống', null];
		}

		try {
			const user = await userRepository.findById(userId.trim(), projection);
			if (!user) return ['Không tìm thấy người dùng', null];
			return [null, user];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy thông tin người dùng', null];
		}
	}

	async getByEmail(email: string, projection?: Record<string, any>): Promise<TErrorFirst<any, IUserDocument | null>> {
		if (isEmpty(email)) {
			return ['Email không được để trống', null];
		}

		try {
			const user = await userRepository.findByEmail(email.trim(), projection);
			if (!user) return ['Không tìm thấy người dùng', null];
			return [null, user];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tìm người dùng', null];
		}
	}

	async getByPhone(phone: string, projection?: Record<string, any>): Promise<TErrorFirst<any, IUserDocument | null>> {
		if (isEmpty(phone)) {
			return ['Số điện thoại không được để trống', null];
		}

		try {
			const user = await userRepository.findByPhone(phone.trim(), projection);
			if (!user) return ['Không tìm thấy người dùng', null];
			return [null, user];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tìm người dùng', null];
		}
	}

	async getPotentialCustomers(limit: number = 10): Promise<TErrorFirst<any, IUserDocument[]>> {
		try {
			const page = 1;
			const sort = {
				'metrics.totalOrders': -1,
				'metrics.totalAmountSpent': -1,
			};
			const result = await userRepository.findWithPagination(page, limit, {}, sort);
			return [null, result.data];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy danh sách khách hàng tiềm năng', null];
		}
	}

	// UPDATE METHODS

	async updateProfile(userId: string, updateData: Partial<IUser>): Promise<TErrorFirst<any, IUserDocument | null>> {
		if (isEmpty(userId)) {
			return ['ID người dùng không được để trống', null];
		}

		try {
			const updatedUser = await userRepository.update({ _id: userId.trim() }, updateData);
			if (!updatedUser) return ['Cập nhật thất bại', null];
			return [null, updatedUser];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi cập nhật thông tin', null];
		}
	}

	async updatePasswordByEmail(email: string, hashedPassword: string, newSalt: Buffer): Promise<TErrorFirst<any, null>> {
		if (isEmpty(email)) {
			return ['Email không được để trống', null];
		}
		if (isEmpty(hashedPassword)) {
			return ['Mật khẩu mới không được để trống', null];
		}

		try {
			await userRepository.update(
				{ email: email.trim() },
				{
					password: hashedPassword.trim(),
					salt: newSalt,
				}
			);
			return [null, null];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi cập nhật mật khẩu', null];
		}
	}

	async updateMetrics(userId: string, metrics: IUserMetrics): Promise<TErrorFirst<any, IUserDocument | null>> {
		if (isEmpty(userId)) {
			return ['ID người dùng không được để trống', null];
		}
		if (!metrics || typeof metrics !== 'object') {
			return ['Dữ liệu metrics không hợp lệ', null];
		}
		try {
			const updatedUser = await userRepository.update({ _id: userId.trim() }, { metrics: metrics });
			if (!updatedUser) return ['Cập nhật metrics thất bại', null];
			return [null, updatedUser];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi cập nhật metrics', null];
		}
	}

	// UTILITY METHODS

	async existsById(userId: string): Promise<boolean> {
		if (isEmpty(userId)) {
			return Promise.resolve(false);
		}
		try {
			const existing = userRepository.exists({ _id: userId.trim() });
			return existing;
		} catch (error) {
			loggerService.error('Lỗi trong quá trình kiểm tra sự tồn tại của người dùng:', error);
			return Promise.resolve(false);
		}
	}

	async existsByEmail(email: string): Promise<boolean> {
		if (isEmpty(email)) {
			return Promise.resolve(false);
		}
		try {
			const existing = await userRepository.exists({ email: email.trim() });
			return existing;
		} catch (error) {
			loggerService.error('Lỗi trong quá trình kiểm tra sự tồn tại của người dùng:', error);
			return false;
		}
	}

	// Đếm số lượng user
	async count(filter?: Record<string, any>): Promise<TErrorFirst<any, number>> {
		try {
			const total = await userRepository.count(filter);
			return [null, total ?? 0];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đếm số lượng người dùng', 0];
		}
	}
}

export const userService = UserService.getInstance();
