'use server';
import { cookies } from 'next/headers';

export async function setCookie(
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

export async function getCookie(name: string): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get(name)?.value;
}

export async function getAllCookies() {
	const cookieStore = await cookies();
	return cookieStore.getAll();
}

export async function deleteCookie(name: string) {
	const cookieStore = await cookies();
	cookieStore.delete(name);
}

export async function hasCookie(name: string): Promise<boolean> {
	const cookieStore = await cookies();
	return cookieStore.has(name);
}

export async function setJsonCookie(name: string, value: any, options?: Parameters<typeof setCookie>[2]) {
	await setCookie(name, JSON.stringify(value), options);
}

export async function getJsonCookie<T = any>(name: string): Promise<T | null> {
	const value = await getCookie(name);
	if (!value) return null;

	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}
