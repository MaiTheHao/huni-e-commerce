import { COOKIE_KEYS } from '@/consts/keys';
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
			maxAge: options?.maxAge || 60 * 60 * 24 * 7,
			httpOnly: options?.httpOnly ?? true,
			secure: options?.secure ?? process.env.NODE_ENV === 'production',
			sameSite: options?.sameSite || 'lax',
			path: options?.path || '/',
			...options,
		});
	}

	async get(name: string): Promise<string | undefined> {
		const cookieStore = await cookies();
		return cookieStore.get(name)?.value;
	}

	async getAll() {
		const cookieStore = await cookies();
		return cookieStore.getAll();
	}

	async delete(name: string) {
		const cookieStore = await cookies();
		cookieStore.delete(name);
	}

	async has(name: string): Promise<boolean> {
		const cookieStore = await cookies();
		return cookieStore.has(name);
	}

	async setJson(name: string, value: any, options?: Parameters<CookieService['set']>[2]) {
		await this.set(name, JSON.stringify(value), options);
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

	async setRefreshToken(token: string): Promise<void> {
		try {
			await this.setJson(COOKIE_KEYS.REFRESH_TOKEN, token, {
				maxAge: 604800,
				httpOnly: true,
				path: '/',
				sameSite: 'lax',
			});
		} catch (error) {
			loggerService.error('Không thể lưu refresh token:', error);
		}
	}

	async getRefreshToken(): Promise<TErrorFirst<any, string | null>> {
		try {
			const token = await this.getJson<string>(COOKIE_KEYS.REFRESH_TOKEN);
			return token ? [null, token] : [null, null];
		} catch (error) {
			loggerService.error('Không thể lấy refresh token:', error);
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi', null];
		}
	}

	async deleteRefreshToken(): Promise<void> {
		try {
			await this.delete(COOKIE_KEYS.REFRESH_TOKEN);
		} catch (error) {
			loggerService.error('Không thể xóa refresh token:', error);
		}
	}
}

export const cookieService = await CookieService.getInstance();
