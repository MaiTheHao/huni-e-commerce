import mongoose, { FilterQuery } from 'mongoose';
import { IPagination } from '../ui';
import { TSortCriteria } from '../filter';

export type PaginatedResult<T> = { data: T; pagination: IPagination };

export interface IMongoRepository<T, D extends mongoose.Document> {
	// BASIC
	create(record: T): Promise<D>;
	findById(_id: string | mongoose.Types.ObjectId, projection?: Record<string, any>): Promise<D | null>;
	update(filter: mongoose.FilterQuery<D>, record: Partial<T>): Promise<D | null>;
	delete(_id: string | mongoose.Types.ObjectId): Promise<D | null>;

	// ADVANCED
	upsert(filter: FilterQuery<D>, record: Partial<Omit<T, '_id'>>): Promise<D | null>;
	findAll(filter?: FilterQuery<D>, projection?: Record<string, any>, sort?: Record<string, any>): Promise<D[]>;
	findOne(filter: FilterQuery<D>, projection?: Record<string, any>, sort?: Record<string, any>): Promise<D | null>;
	findWithPagination(page: number, limit: number, filter?: FilterQuery<D>, sort?: Record<string, any>): Promise<PaginatedResult<D[]>>;
	search(keyword: string, page: number, limit: number, sort?: TSortCriteria, projection?: Record<string, any>): Promise<PaginatedResult<D[]>>;
	filter(criteria: FilterQuery<D>, page: number, limit: number, sort?: any): Promise<PaginatedResult<D[]>>;
	searchFilter(keyword: string, criteria: Record<string, any>, page: number, limit: number, sort?: any): Promise<PaginatedResult<D[]>>;
	count(filter?: FilterQuery<D>): Promise<number>;
}
