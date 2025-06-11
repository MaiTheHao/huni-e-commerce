import { IMongoRepository, IPagination, PaginatedResult, PRODUCT_FILTERABLE_FIELDS, PRODUCT_SEARCHABLE_FIELDS } from '@/interfaces';
import { Model, Document, FilterQuery, Types } from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../database/connection';
import { getPagination } from '@/util/page.util';
import { generateFilterQuery } from '@/util/query/generate-filter-query.util';
import { generateSearchQuery } from '@/util/query/generate-search-query.util';
import { generateSortPipeline } from '@/util/query/generate-sort-pipeline.util';
import { TSortCriteria } from '@/interfaces';

export class MongoBaseRepository<T, D extends Document> implements IMongoRepository<T, D> {
	protected readonly model: Model<D>;
	protected searchableFields = [...PRODUCT_SEARCHABLE_FIELDS] as string[];
	protected filterableFields = [...PRODUCT_FILTERABLE_FIELDS] as string[];

	constructor(model: Model<D>, searchableFields?: any, filterableFields?: any) {
		this.model = model;
		if (searchableFields) this.searchableFields = [...searchableFields] as string[];
		if (filterableFields) this.filterableFields = [...filterableFields] as string[];
	}

	async create(record: Partial<Omit<T, '_id' | 'createdAt' | 'updatedAt'>>): Promise<D> {
		await this.ensureConnected();
		const newRecord = new this.model(record);
		return newRecord.save();
	}

	async findById(_id: string | Types.ObjectId): Promise<D | null> {
		await this.ensureConnected();
		return this.model.findById(_id).exec();
	}

	async update(filter: FilterQuery<D>, record: Partial<T>): Promise<D | null> {
		await this.ensureConnected();
		return this.model.findOneAndUpdate(filter, this.isUpdated(record), { new: true }).exec();
	}

	async upsert(filter: FilterQuery<D>, record: Partial<T>): Promise<D | null> {
		await this.ensureConnected();
		return this.model.findOneAndUpdate(filter, this.isUpdated(record), { new: true, upsert: true }).exec();
	}

	async delete(_id: string | Types.ObjectId): Promise<D | null> {
		await this.ensureConnected();
		return this.model.findByIdAndDelete(_id).exec();
	}

	async findAll(filter?: FilterQuery<D>): Promise<D[]> {
		await this.ensureConnected();
		return this.model
			.find(filter || {})
			.sort({ _id: -1 })
			.exec();
	}

	async findOne(filter: FilterQuery<D>): Promise<D | null> {
		this.ensureConnected();
		return this.model.findOne(filter).exec();
	}

	async findWithPagination(page: number, limit: number, filter?: FilterQuery<D>): Promise<PaginatedResult<D[]>> {
		await this.ensureConnected();
		const skip = (page - 1) * limit;
		const total = await this.model.countDocuments(filter || {}).exec();
		const data = total
			? await this.model
					.find(filter || {})
					.sort({ _id: -1 })
					.skip(skip)
					.limit(limit)
					.exec()
			: [];

		return {
			data,
			pagination: getPagination(page, limit, total),
		};
	}

	async search(keyword: string, page: number, limit: number, sort?: TSortCriteria, projection?: Record<string, any>): Promise<PaginatedResult<D[]>> {
		await this.ensureConnected();
		const skip = (page - 1) * limit;

		// Xây dựng điều kiện tìm kiếm
		const searchQuery = generateSearchQuery<D>(keyword, this.searchableFields);
		const pipeline: any[] = [{ $match: searchQuery }, ...generateSortPipeline(sort), { $skip: skip }, { $limit: limit }];
		if (projection) {
			pipeline.push({ $project: projection });
		}
		const total = await this.model.countDocuments(searchQuery).exec();
		const data = total ? await this.model.aggregate(pipeline).exec() : [];

		return {
			data,
			pagination: getPagination(page, limit, total),
		};
	}

	async filter(criteria: Record<string, any> = {}, page: number, limit: number, sort?: TSortCriteria): Promise<PaginatedResult<D[]>> {
		await this.ensureConnected();
		const skip = (page - 1) * limit;

		// Xây dựng điều kiện lọc
		const filterableCriteria = generateFilterQuery<D>(criteria, this.filterableFields);
		const total = await this.model.countDocuments(filterableCriteria).exec();

		// Thực hiện truy vấn với điều kiện lọc
		const query = this.model.aggregate([{ $match: filterableCriteria }, ...generateSortPipeline(sort), { $skip: skip }, { $limit: limit }]);

		const data = total ? await query.exec() : [];
		return {
			data,
			pagination: getPagination(page, limit, total),
		};
	}

	async searchFilter(keyword: string = '', criteria: Record<string, any> = {}, page: number, limit: number, sort?: TSortCriteria): Promise<{ data: D[]; pagination: IPagination }> {
		await this.ensureConnected();
		const skip = (page - 1) * limit;

		// Xây dựng điều kiện tìm kiếm và lọc
		const searchCondition = generateSearchQuery<D>(keyword, this.searchableFields);
		const filterableCriteria: FilterQuery<D> = generateFilterQuery<D>(criteria, this.filterableFields);

		// Kết hợp điều kiện tìm kiếm và lọc
		const finalQuery = { $and: [searchCondition, filterableCriteria] };

		// Đếm tổng số tài liệu phù hợp với điều kiện và kiểm tra số lượng
		const total = await this.model.countDocuments(finalQuery);
		if (total === 0) {
			return {
				data: [],
				pagination: getPagination(page, limit, total),
			};
		}

		// Thực hiện truy vấn với điều kiện đã kết hợp
		const query = this.model.aggregate([{ $match: filterableCriteria }, ...generateSortPipeline(sort), { $skip: skip }, { $limit: limit }]);

		const data = total ? await query.exec() : [];
		const pagination = getPagination(page, limit, total);

		return {
			data,
			pagination,
		};
	}

	async count(filter?: FilterQuery<D>): Promise<number> {
		await this.ensureConnected();
		return this.model.countDocuments(filter || {}).exec();
	}

	protected isUpdated(record: Partial<T>): Partial<T> & { updatedAt: Date } {
		return { ...record, updatedAt: new Date() };
	}

	protected async ensureConnected(): Promise<void> {
		await connectToDatabase();
	}

	protected async ensureDisconnected(): Promise<void> {
		await disconnectFromDatabase();
	}
}
