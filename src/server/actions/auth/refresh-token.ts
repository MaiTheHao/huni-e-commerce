'use server';
import { blacklistTokenService } from '@/services/blacklist-token.service';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { tokenService } from '@/services/token.service';
import { isEmpty, toString } from '@/util';
import { TErrorFirst } from '@/interfaces';

export async function refreshTokenAction(refreshToken: string): Promise<TErrorFirst<any, { accessToken: string; refreshToken: string }>> {
	if (isEmpty(refreshToken)) {
		return ['Mã xác thực không hợp lệ', null];
	}

	const [blacklistError, isBlacklisted] = await blacklistTokenService.isTokenBlacklisted(refreshToken);
	if (blacklistError) {
		loggerService.error(`Blacklist check error: ${blacklistError}`);
	}
	if (isBlacklisted) {
		loggerService.warning(`Blacklisted JTI used`);
		return ['Token đã bị vô hiệu hóa', null];
	}

	const [verifyError, decoded] = await tokenService.verifyRefreshToken(refreshToken);
	if (verifyError || !decoded) {
		loggerService.error(`Token verification failed: ${verifyError}`);
		if (decoded?.uid) {
			await blacklistTokenService.blacklistTokenByJTI(refreshToken, decoded.uid, 'refresh');
		}
		return ['Refresh token không hợp lệ', null];
	}

	try {
		const [userError, user] = await userService.getById(decoded.uid);
		if (userError || !user) {
			await blacklistTokenService.blacklistTokenByJTI(refreshToken, decoded.uid, 'refresh');
			return ['Không tìm thấy người dùng', null];
		}

		await blacklistTokenService.blacklistTokenByJTI(refreshToken, toString(user._id), 'refresh');
		const newRefreshToken = await tokenService.signRefreshToken({ uid: toString(user._id) });
		const newAccessToken = await tokenService.signAccessToken({
			uid: toString(user._id),
			email: user.email,
			name: user.name,
			avatar: user.avatar,
			roles: user.roles,
			oauthProviders: user.oauthProviders,
		});

		loggerService.info(`Token refreshed successfully - User: ${user.email}, New JTI generated`);

		return [
			null,
			{
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			},
		];
	} catch (err) {
		loggerService.error('Token refresh failed:', err);
		return ['Không thể tạo access token mới', null];
	}
}
