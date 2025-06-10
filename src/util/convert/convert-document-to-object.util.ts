import mongoose from 'mongoose';
import { extractType, toString } from './cast-type.util';

/**
 * Chuyển đổi Mongo Document thành JS Object.
 * @template T Kiểu dữ liệu của Object trả về
 * @param document Mongo Document cần chuyển đổi
 * @returns JS Object tương ứng với Document
 */
export function convertDocumentToObject<T>(document: mongoose.Document): T {
	function transformValue(value: any): any {
		const type = extractType(value);

		if (value instanceof mongoose.Types.ObjectId) {
			return toString(value);
		}

		if (type.isDate) {
			return (value as Date).toISOString();
		}

		if (type.isArray) {
			return (value as any[]).map(transformValue);
		}

		if (type.isObject && !(value instanceof mongoose.Document)) {
			const result: any = {};
			for (const [k, v] of Object.entries(value)) {
				result[k] = transformValue(v);
			}
			return result;
		}

		return value;
	}

	const obj = document.toObject();
	const transformed = transformValue(obj);
	return transformed as T;
}

export function convertDocumentsToObjects<T>(documents: mongoose.Document[]): T[] {
	return documents.map((doc) => convertDocumentToObject<T>(doc));
}
