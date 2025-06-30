import { cookieService } from '@/services/cookie.service';
import { responseService } from '@/services/response.service';
import { refreshTokenAction } from '@/server/actions/auth/refresh-token';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const [cookieError, refreshToken] = await cookieService.getRefreshToken();
	if (cookieError) return responseService.error('Lỗi trong quá trình lấy mã xác thực lại');
	if (!refreshToken) return responseService.unauthorized('Mã xác thực không hợp lệ');

	const [error, data] = await refreshTokenAction(refreshToken as string);

	if (error || !data) {
		await cookieService.quickDeleteAuthToken();
		return responseService.unauthorized(error || 'Làm mới access token thất bại');
	}

	await cookieService.quickSetAuthToken(data.accessToken, data.refreshToken);
	return responseService.success({ accessToken: data.accessToken }, 'Làm mới access token thành công');
}
