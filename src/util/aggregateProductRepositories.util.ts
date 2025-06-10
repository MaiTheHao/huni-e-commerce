import { IPagination, PaginatedResult } from '@/interfaces';
import { PRODUCT_REPOSITORIES } from '@/server/repositories';
import { convertDocumentsToObjects } from './convert';

export async function aggregateProductRepositories<T>(
	action: (repo: any) => Promise<{ data: any[]; pagination?: IPagination }>,
	page: number = 1,
	limit: number = 10
): Promise<PaginatedResult<T[]>> {
	const repositories = Object.values(PRODUCT_REPOSITORIES);

	const responses = await Promise.all(repositories.map(action));

	const data = responses.flatMap((response) => convertDocumentsToObjects<T>(response.data));

	const total = responses.reduce((sum, response) => sum + (response.pagination?.total || 0), 0);

	const pagination: IPagination = {
		total,
		page,
		limit,
		totalPages: Math.ceil(total / limit),
	};

	return { data, pagination };
}
