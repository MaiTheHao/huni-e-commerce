import { FilterQuery } from 'mongoose';

export function generateSearchQuery<D>(keyword: string, searchableFields: string[]): FilterQuery<D> {
	if (!keyword || keyword.trim() === '') {
		return {};
	}

	return {
		$or: searchableFields.map((field) => ({
			[field]: { $regex: keyword.trim(), $options: 'i' },
		})) as FilterQuery<D>[],
	} as FilterQuery<D>;
}
