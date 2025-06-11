import { IProduct, PaginatedResult, IPagination, TSortCriteria, IMongoRepository } from '@/interfaces';
import { PRODUCT_REPOSITORIES } from '@/server/repositories';
import { convertDocumentsToObjects } from '@/util/convert';

class ProductCRUDService {
	private static instance: ProductCRUDService;

	private constructor() {}

	static getInstance(): ProductCRUDService {
		if (!ProductCRUDService.instance) {
			ProductCRUDService.instance = new ProductCRUDService();
		}
		return ProductCRUDService.instance;
	}

	private async aggregateRepositories<T>(
		action: (repo: IMongoRepository<IProduct, any>) => Promise<any>,
		options?: {
			withPagination?: boolean;
			page?: number;
			limit?: number;
			returnFirst?: boolean;
		}
	): Promise<T[] | PaginatedResult<T[]> | T | null> {
		const repositories: IMongoRepository<IProduct, any>[] = Object.values(PRODUCT_REPOSITORIES);
		const { withPagination = false, page = 1, limit = 10, returnFirst = false } = options || {};

		if (returnFirst) {
			for (const repo of repositories) {
				const result = await action(repo);
				if (result) {
					if (Array.isArray(result)) {
						const [item] = convertDocumentsToObjects<T>(result);
						return item;
					}
					const [item] = convertDocumentsToObjects<T>([result]);
					return item;
				}
			}
			return null;
		}

		const responses = await Promise.all(repositories.map(action));

		if (withPagination) {
			const data = responses.flatMap((response) => convertDocumentsToObjects<T>(response?.data || response || []));
			const total = responses.reduce((sum, response) => sum + (response?.pagination?.total || response?.length || 0), 0);

			const pagination: IPagination = {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			};

			return { data, pagination } as PaginatedResult<T[]>;
		}

		const allData = responses.flatMap((response) => convertDocumentsToObjects<T>(response?.data || response || []));

		return allData;
	}

	async findProductById<T>(id: string): Promise<T | null> {
		return this.aggregateRepositories<T>((repo) => repo.findById(id), { returnFirst: true }) as Promise<T | null>;
	}

	async findOne<T>(filter: Record<string, any>): Promise<T | null> {
		return this.aggregateRepositories<T>((repo) => repo.findOne(filter), {
			returnFirst: true,
		}) as Promise<T | null>;
	}

	async findAll<T>(filter?: Record<string, any>): Promise<T[]> {
		return this.aggregateRepositories<T>((repo) => repo.findAll(filter || {})) as Promise<T[]>;
	}

	async search(keyword: string, page: number = 1, limit: number = 10, sort?: TSortCriteria, projection?: Record<string, any>): Promise<PaginatedResult<IProduct[]>> {
		return this.aggregateRepositories<IProduct>((repo) => repo.search(keyword, page, limit, sort, projection), {
			withPagination: true,
			page,
			limit,
		}) as Promise<PaginatedResult<IProduct[]>>;
	}

	async filter<T>(criteria: Record<string, any>, page: number = 1, limit: number = 10, sort?: any): Promise<PaginatedResult<T[]>> {
		return this.aggregateRepositories<T>((repo) => repo.filter(criteria, page, limit, sort), {
			withPagination: true,
			page,
			limit,
		}) as Promise<PaginatedResult<T[]>>;
	}

	async count(filter?: Record<string, any>): Promise<number> {
		const results = (await this.aggregateRepositories<any>((repo) => (repo.count ? repo.count(filter || {}) : repo.findAll(filter || {})))) as any[];

		return results.reduce((sum, result) => sum + (typeof result === 'number' ? result : result.length), 0);
	}
}

export const productCRUDService = ProductCRUDService.getInstance();
