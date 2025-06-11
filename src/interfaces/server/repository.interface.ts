import mongoose, { FilterQuery } from 'mongoose';
import { IPagination } from '../ui';
import { TSortCriteria } from '../filter';

export type PaginatedResult<T> = { data: T; pagination: IPagination };

export interface IRepositoryFactory {
	createRepository<T, D extends mongoose.Document>(entityType: string): IMongoRepository<T, D>;
	registerRepository<T, D extends mongoose.Document>(entityType: string, repositoryClass: new () => IMongoRepository<T, D>): void;
}

export interface IMongoRepository<T, D extends mongoose.Document> {
	// BASIC
	create(record: T): Promise<D>;
	findById(_id: string | mongoose.Types.ObjectId): Promise<D | null>;
	update(filter: mongoose.FilterQuery<D>, record: Partial<T>): Promise<D | null>;
	delete(_id: string | mongoose.Types.ObjectId): Promise<D | null>;

	// ADVANCED
	upsert(filter: FilterQuery<D>, record: Partial<Omit<T, '_id'>>): Promise<D | null>;
	findAll(filter?: FilterQuery<D>): Promise<D[]>;
	findOne(filter: FilterQuery<D>): Promise<D | null>;
	findWithPagination(page: number, limit: number, filter?: FilterQuery<D>): Promise<PaginatedResult<D[]>>;
	search(keyword: string, page: number, limit: number, sort?: TSortCriteria, projection?: Record<string, any>): Promise<PaginatedResult<D[]>>;
	filter(criteria: FilterQuery<D>, page: number, limit: number, sort?: any): Promise<PaginatedResult<D[]>>;
	searchFilter(keyword: string, criteria: Record<string, any>, page: number, limit: number, sort?: any): Promise<PaginatedResult<D[]>>;
	count(filter?: FilterQuery<D>): Promise<number>;
}
