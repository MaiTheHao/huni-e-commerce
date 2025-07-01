import { FilterQuery } from 'mongoose';
import { Types } from 'mongoose';

export function generateSearchQuery<D>(keyword: string, searchableFields: string[]): FilterQuery<D> {
	if (!keyword || keyword.trim() === '') {
		return {};
	}

	const trimmedKeyword = keyword.trim();

	// If searching for _id and it's a valid ObjectId, return exact match (not $or)
	if (searchableFields.includes('_id') && Types.ObjectId.isValid(trimmedKeyword)) {
		return { _id: new Types.ObjectId(trimmedKeyword) } as FilterQuery<D>;
	}

	const orQueries = searchableFields
		.filter((field) => field !== '_id')
		.map((field) => ({
			[field]: { $regex: trimmedKeyword, $options: 'i' },
		})) as FilterQuery<D>[];

	return orQueries.length > 0 ? ({ $or: orQueries } as FilterQuery<D>) : {};
}
