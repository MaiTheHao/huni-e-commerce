import mongoose from 'mongoose';

export function toNumber(value: unknown, defaultValue: number = 0): number {
	const num = Number(value);
	return isNaN(num) ? defaultValue : num;
}

export function toString(value: unknown, defaultValue: string = ''): string {
	if (typeof value === 'string') return value;
	if (value instanceof mongoose.Types.ObjectId) return value.toString();
	if (value && typeof value === 'object' && '_id' in value) {
		const objId = value as { _id: mongoose.Types.ObjectId };
		return objId._id.toString();
	}
	return value != null ? String(value) : defaultValue;
}

export function toBoolean(value: unknown, defaultValue: boolean = false): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'string') {
		const val = value.trim().toLowerCase();
		if (val === 'true') return true;
		if (val === 'false') return false;
	}
	if (typeof value === 'number') return value !== 0;
	return defaultValue;
}

export function toArray<T>(value: unknown, defaultValue: T[] = []): T[] {
	if (Array.isArray(value)) return value as T[];
	if (value == null) return defaultValue;
	return [value as T];
}

export function toDate(value: unknown, defaultValue: Date = new Date(0)): Date {
	const date = new Date(value as any);
	return isNaN(date.getTime()) ? defaultValue : date;
}

export function extractType(value: unknown): {
	isArray: boolean;
	isObject: boolean;
	isBoolean: boolean;
	isString: boolean;
	isDate: boolean;
	isNumber: boolean;
	isNull: boolean;
	isUndefined: boolean;
} {
	return {
		isArray: Array.isArray(value),
		isObject: typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date),
		isBoolean: typeof value === 'boolean',
		isString: typeof value === 'string',
		isDate: value instanceof Date,
		isNumber: typeof value === 'number' && !isNaN(value as number),
		isNull: value === null,
		isUndefined: value === undefined,
	};
}
