import { blacklistTokenService } from '@/services/blacklist-token.service';
import { cookieService } from '@/services/cookie.service';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { isEmpty, toString } from '@/util';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	const [error, refreshToken] = await cookieService.getRefreshToken();
	if (error) return responseService.error('Lỗi trong quá trình lấy mã xác thực lại');
	if (isEmpty(refreshToken)) return responseService.unauthorized('Mã xác thực không hợp lệ');

	const [blacklistError, isBlacklisted] = await blacklistTokenService.isTokenBlacklisted(refreshToken as string);
	if (blacklistError) {
		loggerService.error(`Blacklist check error: ${blacklistError}`);
	} else if (isBlacklisted) {
		loggerService.warning(`Blacklisted JTI used`);
		await cookieService.deleteRefreshToken();
		return responseService.unauthorized('Token đã bị vô hiệu hóa');
	}
	const [verifyError, decoded] = await tokenService.verifyRefreshToken(refreshToken as string);
	if (verifyError || !decoded) {
		loggerService.error(`Token verification failed: ${verifyError}`);
		if (decoded?.uid) {
			await blacklistTokenService.blacklistTokenByJTI(refreshToken as string, decoded.uid, 'refresh');
		}

		await cookieService.deleteRefreshToken();
		return responseService.unauthorized('Refresh token không hợp lệ');
	}
	try {
		const [userError, user] = await userService.getById(decoded.uid);
		if (userError || !user) {
			await blacklistTokenService.blacklistTokenByJTI(refreshToken as string, decoded.uid, 'refresh');

			await cookieService.deleteRefreshToken();
			return responseService.unauthorized('Không tìm thấy người dùng');
		}

		await blacklistTokenService.blacklistTokenByJTI(refreshToken as string, toString(user._id), 'refresh');
		const newRefreshToken = await tokenService.signRefreshToken({ uid: toString(user._id) });
		const newAccessToken = await tokenService.signAccessToken({
			uid: toString(user._id),
			email: user.email,
			name: user.name,
			avatar: user.avatar,
			roles: user.roles,
			oauthProviders: user.oauthProviders,
		});

		await cookieService.setRefreshToken(newRefreshToken);

		loggerService.info(`Token refreshed successfully - User: ${user.email}, New JTI generated`);

		return responseService.success({ accessToken: newAccessToken }, 'Làm mới access token thành công');
	} catch (err) {
		loggerService.error('Token refresh failed:', err);
		return responseService.error('Không thể tạo access token mới', undefined, err);
	}
}
