import { responseService } from '@/services/response.service';
import { loggerService } from '@/services/logger.service';
import { authService } from '@/services/auth/auth.service';
import { cookieService } from '@/services/cookie.service';
import { blacklistTokenService } from '@/services/blacklist-token.service';
import { tokenService } from '@/services/token.service';

export async function POST() {
	try {
		const [cookieError, refreshToken] = await cookieService.getRefreshToken();
		if (cookieError) {
			loggerService.error('Lỗi khi lấy refresh token:', cookieError);
		}
		if (refreshToken) {
			const [verifyError, decoded] = await tokenService.verifyRefreshToken(refreshToken as string);
			if (verifyError || !decoded) {
				loggerService.error('Lỗi xác thực refresh token khi logout:', verifyError);
			} else {
				await blacklistTokenService.blacklistTokenByJTI(refreshToken as string, decoded.uid, 'refresh');
			}
		}

		await cookieService.quickDeleteAuthToken();

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
