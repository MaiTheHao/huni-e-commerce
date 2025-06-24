import { IAccessTokenPayload, IEmailVerifyTokenPayload, IRefreshTokenPayload, IResetPasswordTokenPayload, TErrorFirst } from '@/interfaces';
import jwt from 'jsonwebtoken';
import { loggerService } from './logger.service';
import { randomUUID } from 'crypto';

class TokenService {
	private static instance: TokenService;
	private constructor() {}
	static getInstance(): TokenService {
		if (!TokenService.instance) {
			TokenService.instance = new TokenService();
		}
		return TokenService.instance;
	}

	private generateJTI(): string {
		return randomUUID();
	}

	extractJTI(token: string): TErrorFirst<any, string | null> {
		try {
			const [error, decoded] = this.decodeToken<{ jti?: string }>(token);
			if (error || !decoded?.jti) {
				return ['Token không có JTI hoặc không hợp lệ', null];
			}
			return [null, decoded.jti];
		} catch (err) {
			return [err instanceof Error ? err.message : 'Lỗi extract JTI', null];
		}
	}

	async signToken<T>(payload: any | T, secret: string, expiresIn: string = '1m'): Promise<string> {
		loggerService.debug('Tạo token với setups: ', `secret: ${secret}, expiresIn: ${expiresIn}`);
		return new Promise<string>((resolve, reject) => {
			jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions, (err, token) => {
				if (err || !token) {
					return reject(err);
				}
				resolve(token);
			});
		});
	}

	async verifyToken<T>(token: string, secret: string): Promise<TErrorFirst<jwt.VerifyErrors, T | null>> {
		return new Promise((resolve) => {
			jwt.verify(token, secret, (err, decoded) => {
				if (err) return resolve([err, null]);
				resolve([null, (decoded as T) || null]);
			});
		});
	}

	decodeToken<T>(token: string): TErrorFirst<any, T | null> {
		try {
			const decoded = jwt.decode(token);
			return [null, decoded ? (decoded as { exp: number; iat: number } & T) : null];
		} catch (err) {
			return [err, null];
		}
	}

	// Sign
	async signAccessToken(payload: Omit<IAccessTokenPayload, 'jti'>): Promise<string> {
		return this.signToken({ ...payload, jti: this.generateJTI() }, process.env.ACCESS_TOKEN_SECRET || '', process.env.ACCESS_TOKEN_EXPIRATION || '15m');
	}

	async signRefreshToken(payload: Omit<IRefreshTokenPayload, 'jti'>): Promise<string> {
		return this.signToken({ ...payload, jti: this.generateJTI() }, process.env.REFRESH_TOKEN_SECRET || '', process.env.REFRESH_TOKEN_EXPIRATION || '7d');
	}

	async signEmailVerificationToken(payload: IEmailVerifyTokenPayload): Promise<string> {
		return this.signToken(payload, process.env.EMAIL_VERIFY_TOKEN_SECRET || '', process.env.EMAIL_VERIFY_TOKEN_EXPIRATION || '1h');
	}

	async signResetPasswordToken(payload: IResetPasswordTokenPayload): Promise<string> {
		return this.signToken(payload, process.env.RESET_PASSWORD_TOKEN_SECRET || '', process.env.RESET_PASSWORD_TOKEN_EXPIRATION || '5m');
	}

	// Verify
	async verifyAccessToken(token: string): Promise<TErrorFirst<jwt.VerifyErrors, IAccessTokenPayload | null>> {
		return this.verifyToken<IAccessTokenPayload>(token, process.env.ACCESS_TOKEN_SECRET || '');
	}

	async verifyRefreshToken(token: string): Promise<TErrorFirst<jwt.VerifyErrors, IRefreshTokenPayload | null>> {
		return this.verifyToken<IRefreshTokenPayload>(token, process.env.REFRESH_TOKEN_SECRET || '');
	}

	async verifyEmailVerificationToken(token: string): Promise<TErrorFirst<jwt.VerifyErrors, IEmailVerifyTokenPayload | null>> {
		return this.verifyToken<IEmailVerifyTokenPayload>(token, process.env.EMAIL_VERIFY_TOKEN_SECRET || '');
	}

	async verifyResetPasswordToken(token: string): Promise<TErrorFirst<jwt.VerifyErrors, IResetPasswordTokenPayload | null>> {
		return this.verifyToken<IResetPasswordTokenPayload>(token, process.env.RESET_PASSWORD_TOKEN_SECRET || '');
	}

	// Decode
	decodeAccessToken(token: string): TErrorFirst<any, IAccessTokenPayload | null> {
		return this.decodeToken<IAccessTokenPayload>(token);
	}

	decodeRefreshToken(token: string): TErrorFirst<any, IRefreshTokenPayload | null> {
		return this.decodeToken<IRefreshTokenPayload>(token);
	}

	decodeEmailVerificationToken(token: string): TErrorFirst<any, IEmailVerifyTokenPayload | null> {
		return this.decodeToken<IEmailVerifyTokenPayload>(token);
	}
}

export const tokenService = TokenService.getInstance();
