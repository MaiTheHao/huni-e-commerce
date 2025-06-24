import { responseService } from '@/services/response.service';
import { loggerService } from '@/services/logger.service';
import { authService } from '@/services/auth/auth.service';

export async function POST() {
	try {
		const [error, _] = await authService.logout();

		if (error) {
			loggerService.error('Lỗi khi đăng xuất:', error);
			return responseService.error('Đăng xuất thất bại', 500, error);
		}

		return responseService.success(null, 'Đăng xuất thành công');
	} catch (error) {
		loggerService.error('Lỗi khi đăng xuất:', error);
		return responseService.error('Đăng xuất thất bại', 500, error);
	}
}
