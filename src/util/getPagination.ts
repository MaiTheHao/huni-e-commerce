import { IPagination } from '@/interfaces';

export function getPagination(page: number, limit: number, total: number): IPagination {
	const totalPages = Math.ceil(total / limit);
	return {
		page,
		limit,
		total,
		totalPages,
	};
}
