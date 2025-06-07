import { TSortCriteria } from '@/interfaces/filter-sort-criteria.interface';

export function generateSortPipeline(criteria: TSortCriteria | unknown): any[] {
	const sortPipeline: any[] = [];

	if (!criteria || typeof criteria !== 'object') {
		return [{ $sort: { _id: -1 } }];
	}

	const addFields: Record<string, any> = {};
	const sort: Record<string, number> = {};

	for (const [key, value] of Object.entries(criteria as Record<string, any>)) {
		const { customSortOrder, order } = value;
		if (Array.isArray(customSortOrder) && customSortOrder.length > 0) {
			const customField = `${key}_custom_sort`;
			addFields[customField] = {
				$indexOfArray: [customSortOrder, `$${key}`],
			};
			sort[customField] = order === 1 ? 1 : -1;
		} else {
			sort[key] = order === 1 ? 1 : -1;
		}
	}

	if (Object.keys(addFields).length) {
		sortPipeline.push({ $addFields: addFields });
	}

	if (Object.keys(sort).length) {
		sortPipeline.push({ $sort: sort });
	} else {
		sortPipeline.push({ $sort: { _id: -1 } });
	}

	return sortPipeline;
}
