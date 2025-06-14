export interface IResponse<T = any> {
	message?: string;
	data?: T;
	error?: any;
}

export type TErrorFirst<E = any, T = any> = [error: E | null, data: T | null];
