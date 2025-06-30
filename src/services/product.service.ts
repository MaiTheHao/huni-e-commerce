import { IProduct, PaginatedResult, IPagination, TSortCriteria, IMongoRepository, TErrorFirst } from '@/interfaces';
import { PRODUCT_REPOSITORIES } from '@/server/repositories';
import { convertDocumentsToObjects } from '@/util/convert';

class ProductService {
	private static instance: ProductService;

	private constructor() {}

	static getInstance(): ProductService {
		if (!ProductService.instance) {
			ProductService.instance = new ProductService();
		}
		return ProductService.instance;
	}

	// READ METHODS

	async findProductById<T>(id: string): Promise<TErrorFirst<any, T | null>> {
		return this.aggregateRepoWithConverter<T>((repo) => repo.findById(id), { returnFirst: true }) as Promise<TErrorFirst<any, T | null>>;
	}

	async findOne<T>(filter: Record<string, any>): Promise<TErrorFirst<any, T | null>> {
		return this.aggregateRepoWithConverter<T>((repo) => repo.findOne(filter), { returnFirst: true }) as Promise<TErrorFirst<any, T | null>>;
	}

	async findAll<T>(filter?: Record<string, any>): Promise<TErrorFirst<any, T[]>> {
		return this.aggregateRepoWithConverter<T>((repo) => repo.findAll(filter || {})) as Promise<TErrorFirst<any, T[]>>;
	}

	async search(keyword: string, page: number = 1, limit: number = 10, sort?: TSortCriteria, projection?: Record<string, any>): Promise<TErrorFirst<any, PaginatedResult<IProduct[]>>> {
		return this.aggregateRepoWithConverter<IProduct>((repo) => repo.search(keyword, page, limit, sort, projection), { withPagination: true, page, limit }) as Promise<
			TErrorFirst<any, PaginatedResult<IProduct[]>>
		>;
	}

	async filter<T>(criteria: Record<string, any>, page: number = 1, limit: number = 10, sort?: any): Promise<TErrorFirst<any, PaginatedResult<T[]>>> {
		return this.aggregateRepoWithConverter<T>((repo) => repo.filter(criteria, page, limit, sort), { withPagination: true, page, limit }) as Promise<TErrorFirst<any, PaginatedResult<T[]>>>;
	}

	async count(filter?: Record<string, any>): Promise<TErrorFirst<any, number>> {
		const [error, count] = await this.aggregateRepoNoConverter<any>((repo) => repo.count(filter || {}));
		if (error) return [error, null];
		return [null, count];
	}

	// UTILITY METHODS
	private async aggregateRepoWithConverter<T>(
		action: (repo: IMongoRepository<IProduct, any>) => Promise<any>,
		options?: {
			withPagination?: boolean;
			page?: number;
			limit?: number;
			returnFirst?: boolean;
		}
	): Promise<TErrorFirst<any, T | T[] | PaginatedResult<T[]> | null>> {
		const repositories = Object.values(PRODUCT_REPOSITORIES) as IMongoRepository<IProduct, any>[];
		const { withPagination = false, page = 1, limit = 10, returnFirst = false } = options || {};

		try {
			if (returnFirst) {
				for (const repo of repositories) {
					try {
						const result = await action(repo);
						if (result) {
							const items = Array.isArray(result) ? result : [result];
							const [item] = convertDocumentsToObjects<T>(items);
							return [null, item ?? null];
						}
					} catch {
						continue;
					}
				}
				return ['Không tìm thấy sản phẩm', null];
			}

			const responses = await Promise.all(
				repositories.map(async (repo) => {
					try {
						return await action(repo);
					} catch {
						return withPagination ? { data: [], pagination: {} } : [];
					}
				})
			);

			if (withPagination) {
				const data = responses.flatMap((res) => convertDocumentsToObjects<T>(res?.data || res || []));
				const total = responses.reduce((sum, res) => sum + (res?.pagination?.total || res?.length || 0), 0);

				const pagination: IPagination = {
					total,
					page,
					limit,
					totalPages: Math.ceil(total / limit),
				};

				return [null, { data, pagination } as PaginatedResult<T[]>];
			}

			const allData = responses.flatMap((res) => convertDocumentsToObjects<T>(res?.data || res || []));
			return [null, allData];
		} catch (error) {
			return [error, null];
		}
	}

	private async aggregateRepoNoConverter<T>(action: (repo: IMongoRepository<IProduct, any>) => Promise<T>, options?: { returnFirst?: boolean }): Promise<TErrorFirst<any, T | T[] | null>> {
		const repositories = Object.values(PRODUCT_REPOSITORIES) as IMongoRepository<IProduct, any>[];
		const { returnFirst = false } = options || {};

		try {
			if (returnFirst) {
				for (const repo of repositories) {
					try {
						const result = await action(repo);
						if (result !== undefined && result !== null) {
							return [null, result];
						}
					} catch {
						continue;
					}
				}
				return ['Không tìm thấy kết quả', null];
			}

			const responses = await Promise.all(
				repositories.map(async (repo) => {
					try {
						return await action(repo);
					} catch {
						return null;
					}
				})
			);

			return [null, responses.filter((r) => r !== null) as T[]];
		} catch (error) {
			return [error, null];
		}
	}
}

export const productService = ProductService.getInstance();
