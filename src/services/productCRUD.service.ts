import { IProduct, PaginatedResult, IPagination, TSortCriteria, IMongoRepository, TErrorFirst } from '@/interfaces';
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
	): Promise<TErrorFirst<any, T | T[] | PaginatedResult<T[]> | null>> {
		const repositories: IMongoRepository<IProduct, any>[] = Object.values(PRODUCT_REPOSITORIES);
		const { withPagination = false, page = 1, limit = 10, returnFirst = false } = options || {};

		if (returnFirst) {
			for (const repo of repositories) {
				const result = await action(repo);
				if (result) {
					if (Array.isArray(result)) {
						const [item] = convertDocumentsToObjects<T>(result);
						return [null, item];
					}
					const [item] = convertDocumentsToObjects<T>([result]);
					return [null, item];
				}
			}
			return ['Không tìm thấy sản phẩm', null];
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

			return [null, { data, pagination } as PaginatedResult<T[]>];
		}

		const allData = responses.flatMap((response) => convertDocumentsToObjects<T>(response?.data || response || []));

		return [null, allData];
	}

	async findProductById<T>(id: string): Promise<TErrorFirst<any, T | null>> {
		return this.aggregateRepositories<T>((repo) => repo.findById(id), { returnFirst: true }) as Promise<TErrorFirst<any, T | null>>;
	}

	async findOne<T>(filter: Record<string, any>): Promise<TErrorFirst<any, T | null>> {
		return this.aggregateRepositories<T>((repo) => repo.findOne(filter), {
			returnFirst: true,
		}) as Promise<TErrorFirst<any, T | null>>;
	}

	async findAll<T>(filter?: Record<string, any>): Promise<TErrorFirst<any, T[]>> {
		return this.aggregateRepositories<T>((repo) => repo.findAll(filter || {})) as Promise<TErrorFirst<any, T[]>>;
	}

	async search(keyword: string, page: number = 1, limit: number = 10, sort?: TSortCriteria, projection?: Record<string, any>): Promise<TErrorFirst<any, PaginatedResult<IProduct[]>>> {
		return this.aggregateRepositories<IProduct>((repo) => repo.search(keyword, page, limit, sort, projection), {
			withPagination: true,
			page,
			limit,
		}) as Promise<TErrorFirst<any, PaginatedResult<IProduct[]>>>;
	}

	async filter<T>(criteria: Record<string, any>, page: number = 1, limit: number = 10, sort?: any): Promise<TErrorFirst<any, PaginatedResult<T[]>>> {
		return this.aggregateRepositories<T>((repo) => repo.filter(criteria, page, limit, sort), {
			withPagination: true,
			page,
			limit,
		}) as Promise<TErrorFirst<any, PaginatedResult<T[]>>>;
	}

	async count(filter?: Record<string, any>): Promise<TErrorFirst<any, number>> {
		const [error, results] = (await this.aggregateRepositories<any>((repo) => (repo.count ? repo.count(filter || {}) : repo.findAll(filter || {})))) as TErrorFirst<any, any[]>;

		if (error) return [error, null];

		const count = (results as any[]).reduce((sum, result) => sum + (typeof result === 'number' ? result : result.length), 0);
		return [null, count];
	}
}

export const productCRUDService = ProductCRUDService.getInstance();
