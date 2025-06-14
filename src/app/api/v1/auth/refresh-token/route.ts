import { cookieService } from '@/services/cookie.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { isEmpty } from '@/util';

export async function POST() {
	// Lấy refreshToken từ cookie
	const [error, refreshToken] = await cookieService.getRefreshToken();
	if (error) return responseService.error('Lỗi trong quá trình lấy mã xác thực lại');
	if (isEmpty(refreshToken)) return responseService.notFound('Không có mã xác thực lại');

	// Xác thực refreshToken
	const [verifyError, decoded] = await tokenService.verifyRefreshToken(refreshToken as string);
	console.log(decoded);
	if (verifyError || !decoded) {
		loggerService.error(`Xác thực refresh token thất bại: ${verifyError}`);
		return responseService.unauthorized('Refresh token không hợp lệ hoặc đã hết hạn');
	}

	// Tạo accessToken mới
	try {
		const accessToken = await tokenService.signAccessToken({ uid: decoded.uid });
		return responseService.success({ accessToken }, 'Làm mới access token thành công');
	} catch (err) {
		return responseService.error('Không thể tạo access token mới', undefined, err);
	}
}
