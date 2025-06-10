import { FilterQuery } from 'mongoose';
import { extractType } from '../convert/cast-type.util';

function buildRangeQuery(value: any) {
	if (value && typeof value === 'object' && ('min' in value || 'max' in value)) {
		const range: Record<string, any> = {};
		if ('min' in value) range['$gte'] = value.min;
		if ('max' in value) range['$lte'] = value.max;
		return range;
	}
	return null;
}

export function generateFilterQuery<D>(criteria: Record<string, any>, filterableFields: string[]): FilterQuery<D> {
	const filterableCriteria: Record<string, any> = {};

	for (const [key, value] of Object.entries(criteria)) {
		if (!filterableFields.includes(key)) continue;

		const rangeQuery = buildRangeQuery(value);
		if (rangeQuery) {
			filterableCriteria[key] = rangeQuery;
			continue;
		}

		const { isArray } = extractType(value);
		filterableCriteria[key] = isArray ? { $in: value } : value;
	}

	return filterableCriteria as FilterQuery<D>;
}
