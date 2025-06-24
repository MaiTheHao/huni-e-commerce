import { blacklistTokenRepository } from '@/server/repositories/blacklist-token.repository';
import { TErrorFirst } from '@/interfaces';
import { loggerService } from './logger.service';
import { tokenService } from './token.service';

class BlacklistTokenService {
	private static instance: BlacklistTokenService;

	private constructor() {}

	static getInstance(): BlacklistTokenService {
		if (!BlacklistTokenService.instance) {
			BlacklistTokenService.instance = new BlacklistTokenService();
		}
		return BlacklistTokenService.instance;
	}

	async blacklistTokenByJTI(token: string, userId: string, tokenType: 'refresh' | 'access'): Promise<TErrorFirst<any, boolean>> {
		try {
			const [jtiError, jti] = tokenService.extractJTI(token);
			if (jtiError || !jti) {
				return ['Token không có JTI hợp lệ', false];
			}

			const [decodeError, decoded] = tokenService.decodeToken<{ iat?: number; exp?: number }>(token);
			if (decodeError || !decoded?.exp || !decoded?.iat) {
				return ['Token không có thông tin thời gian hợp lệ', false];
			}

			const issuedAt = new Date(decoded.iat * 1000);
			const expiresAt = new Date(decoded.exp * 1000);
			await blacklistTokenRepository.addToBlacklist(jti, userId, tokenType, issuedAt, expiresAt);

			loggerService.info(`Token blacklisted - JTI: ${jti}, User: ${userId}, Type: ${tokenType}`);

			return [null, true];
		} catch (error) {
			loggerService.error('Failed to blacklist token by JTI:', error);
			return [error instanceof Error ? error.message : 'Lỗi blacklist token', false];
		}
	}

	async isTokenBlacklisted(token: string): Promise<TErrorFirst<any, boolean>> {
		try {
			const [jtiError, jti] = tokenService.extractJTI(token);
			if (jtiError || !jti) {
				loggerService.warning('Token without JTI encountered');
				return [null, false];
			}

			const isBlacklisted = await blacklistTokenRepository.isJTIBlacklisted(jti);
			return [null, isBlacklisted];
		} catch (error) {
			loggerService.error('Failed to check token blacklist:', error);
			return [null, false];
		}
	}

	async blacklistUserTokens(userId: string, tokenType: 'refresh' | 'access' | 'all', issuedBefore?: Date): Promise<TErrorFirst<any, number>> {
		try {
			const count = await blacklistTokenRepository.blacklistUserAllTokens(userId, tokenType, issuedBefore);

			loggerService.info(`Blacklisted ${count} tokens for user: ${userId}, Type: ${tokenType}`);
			return [null, count];
		} catch (error) {
			loggerService.error('Failed to blacklist user tokens:', error);
			return [error instanceof Error ? error.message : 'Lỗi blacklist user tokens', 0];
		}
	}
}

export const blacklistTokenService = BlacklistTokenService.getInstance();
