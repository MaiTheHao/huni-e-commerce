import { COOKIE_KEYS_MAP } from '@/consts/map-value';
import { TErrorFirst } from '@/interfaces';
import { loggerService } from '@/services/logger.service';
import { cookies } from 'next/headers';

class CookieService {
	private static instance: CookieService;

	private constructor() {}

	static async getInstance(): Promise<CookieService> {
		if (!CookieService.instance) {
			CookieService.instance = new CookieService();
		}
		return CookieService.instance;
	}

	// CREATE/SET METHODS

	async set(
		name: string,
		value: string,
		options?: {
			maxAge?: number;
			expires?: Date;
			httpOnly?: boolean;
			secure?: boolean;
			sameSite?: 'strict' | 'lax' | 'none';
			path?: string;
		}
	) {
		const cookieStore = await cookies();
		cookieStore.set(name, value, {
			maxAge: options?.maxAge ?? (Number(process.env.COOKIE_MAX_AGE) || 60 * 60 * 24 * 7),
			httpOnly: options?.httpOnly ?? true,
			secure: options?.secure ?? process.env.COOKIE_SECURE === 'true',
			sameSite: options?.sameSite ?? ((process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'lax'),
			path: options?.path ?? '/',
			...options,
		});
	}

	async setJson(name: string, value: any, options?: Parameters<CookieService['set']>[2]) {
		await this.set(name, JSON.stringify(value), options);
	}

	async setRefreshToken(token: string): Promise<void> {
		try {
			await this.setJson(COOKIE_KEYS_MAP.REFRESH_TOKEN, token, {
				maxAge: 604800,
				httpOnly: true,
				path: '/',
				sameSite: 'lax',
			});
		} catch (error) {
			loggerService.error('Không thể lưu refresh token:', error);
		}
	}

	async setAccessToken(token: string): Promise<void> {
		try {
			await this.setJson(COOKIE_KEYS_MAP.ACCESS_TOKEN, token, {
				maxAge: 1800,
				httpOnly: false,
				path: '/',
				sameSite: 'lax',
			});
		} catch (error) {
			loggerService.error('Không thể lưu access token:', error);
		}
	}

	// READ/GET METHODS

	async get(name: string): Promise<string | undefined> {
		const cookieStore = await cookies();
		return cookieStore.get(name)?.value;
	}

	async getJson<T = any>(name: string): Promise<T | null> {
		const value = await this.get(name);
		if (!value) return null;
		try {
			return JSON.parse(value);
		} catch {
			return null;
		}
	}

	async getAll() {
		const cookieStore = await cookies();
		return cookieStore.getAll();
	}

	async getRefreshToken(): Promise<TErrorFirst<any, string | null>> {
		try {
			const token = await this.getJson<string>(COOKIE_KEYS_MAP.REFRESH_TOKEN);
			return token ? [null, token] : [null, null];
		} catch (error) {
			loggerService.error('Không thể lấy refresh token:', error);
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi', null];
		}
	}

	async getAccessToken(): Promise<TErrorFirst<any, string | null>> {
		try {
			const token = await this.getJson<string>(COOKIE_KEYS_MAP.ACCESS_TOKEN);
			return token ? [null, token] : [null, null];
		} catch (error) {
			loggerService.error('Không thể lấy access token:', error);
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi', null];
		}
	}

	// DELETE METHODS

	async delete(name: string) {
		const cookieStore = await cookies();
		cookieStore.delete(name);
	}

	async deleteRefreshToken(): Promise<void> {
		try {
			await this.delete(COOKIE_KEYS_MAP.REFRESH_TOKEN);
		} catch (error) {
			loggerService.error('Không thể xóa refresh token:', error);
		}
	}

	async deleteAccessToken(): Promise<void> {
		try {
			await this.delete(COOKIE_KEYS_MAP.ACCESS_TOKEN);
		} catch (error) {
			loggerService.error('Không thể xóa access token:', error);
		}
	}

	// UTILITY METHODS

	async quickSetAuthToken(accessToken: string, refreshToken: string): Promise<void> {
		try {
			await this.setAccessToken(accessToken);
			await this.setRefreshToken(refreshToken);
		} catch (error) {
			loggerService.error('Không thể thiết lập token:', error);
		}
	}

	async quickDeleteAuthToken(): Promise<void> {
		try {
			await this.deleteAccessToken();
			await this.deleteRefreshToken();
		} catch (error) {
			loggerService.error('Không thể xóa token:', error);
		}
	}

	async has(name: string): Promise<boolean> {
		const cookieStore = await cookies();
		return cookieStore.has(name);
	}
}

export const cookieService = await CookieService.getInstance();
