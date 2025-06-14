import { cookieService } from '@/services/cookie.service';
import { responseService } from '@/services/response.service';
import { loggerService } from '@/services/logger.service';

export async function POST() {
	try {
		await cookieService.deleteRefreshToken();
		return responseService.success(null, 'Đăng xuất thành công');
	} catch (error) {
		loggerService.error('Lỗi khi đăng xuất:', error);
		return responseService.error('Đăng xuất thất bại', 500, error);
	}
}
