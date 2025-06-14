import { IAccessTokenPayload, IEmailVerifyTokenPayload, IRefreshTokenPayload, TErrorFirst } from '@/interfaces';
import jwt from 'jsonwebtoken';
import { loggerService } from './logger.service';

class TokenService {
	private static instance: TokenService;
	private constructor() {}
	static getInstance(): TokenService {
		if (!TokenService.instance) {
			TokenService.instance = new TokenService();
		}
		return TokenService.instance;
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

	async decodeToken<T>(token: string): Promise<TErrorFirst<any, T | null>> {
		return new Promise((resolve, reject) => {
			try {
				const decoded = jwt.decode(token);
				resolve([null, decoded as T | null]);
			} catch (err) {
				reject([err, null]);
			}
		});
	}

	// Sign
	async signAccessToken<T>(payload: IAccessTokenPayload): Promise<string> {
		return this.signToken<T>(payload, process.env.ACCESS_TOKEN_SECRET || '', process.env.ACCESS_TOKEN_EXPIRATION || '15m');
	}

	async signRefreshToken<T>(payload: IRefreshTokenPayload): Promise<string> {
		return this.signToken<T>(payload, process.env.REFRESH_TOKEN_SECRET || '', process.env.REFRESH_TOKEN_EXPIRATION || '7d');
	}

	async signEmailVerificationToken<T>(payload: IEmailVerifyTokenPayload): Promise<string> {
		return this.signToken<T>(payload, process.env.EMAIL_VERIFY_TOKEN_SECRET || '', process.env.EMAIL_VERIFY_TOKEN_EXPIRATION || '1h');
	}

	// Verify
	async verifyAccessToken(token: string): Promise<TErrorFirst<jwt.VerifyErrors, IAccessTokenPayload | null>> {
		return this.verifyToken<IAccessTokenPayload>(token, process.env.ACCESS_TOKEN_SECRET || '');
	}

	async verifyRefreshToken(token: string): Promise<TErrorFirst<jwt.VerifyErrors, IRefreshTokenPayload | null>> {
		return this.verifyToken<IRefreshTokenPayload>(token, process.env.REFRESH_TOKEN_SECRET || '');
	}

	async verifyEmailVerificationToken<T>(token: string): Promise<TErrorFirst<jwt.VerifyErrors, T | null>> {
		return this.verifyToken<T>(token, process.env.EMAIL_VERIFY_TOKEN_SECRET || '');
	}
}

export const tokenService = TokenService.getInstance();
