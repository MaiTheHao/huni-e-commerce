import mongoose from 'mongoose';

export function convertDocumentToObject<T>(document: mongoose.Document): T {
	const plainObject: any = {};
	for (const [key, value] of Object.entries(document.toObject())) {
		if (value instanceof mongoose.Types.ObjectId) {
			plainObject[key] = value.toString();
		} else if (value instanceof Date) {
			plainObject[key] = value.toISOString();
		} else {
			plainObject[key] = value;
		}
	}
	return plainObject as T;
}

export function convertDocumentsToObjects<T>(documents: mongoose.Document[]): T[] {
	return documents.map((doc) => convertDocumentToObject<T>(doc));
}
