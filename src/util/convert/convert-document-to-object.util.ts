import mongoose from 'mongoose';
import { extractType, toString } from './cast-type.util';

/**
 * Chuyển đổi Mongo Document thành JS Object.
 * @template T Kiểu dữ liệu của Object trả về
 * @param document Mongo Document cần chuyển đổi
 * @returns JS Object tương ứng với Document
 */
export function convertDocumentToObject<T>(document: mongoose.Document): T {
	const isPlainObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val) && !(val instanceof mongoose.Document);

	function transformValue(value: any): any {
		if (value instanceof mongoose.Types.ObjectId) {
			return toString(value);
		}
		if (value instanceof Date) {
			return value.toISOString();
		}
		if (Array.isArray(value)) {
			return value.map(transformValue);
		}
		if (isPlainObject(value)) {
			return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, transformValue(v)]));
		}
		return value;
	}

	const obj = document instanceof mongoose.Document && typeof document.toObject === 'function' ? document.toObject({ depopulate: true, flattenMaps: true, virtuals: true }) : document;

	return transformValue(obj) as T;
}

export function convertDocumentsToObjects<T>(documents: mongoose.Document[]): T[] {
	return documents.map((doc) => convertDocumentToObject<T>(doc));
}
