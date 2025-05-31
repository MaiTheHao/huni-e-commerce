import {
	IMongoRepository,
	IPagination,
	PaginatedResult,
	PRODUCT_FILTERABLE_FIELDS,
	PRODUCT_SEARCHABLE_FIELDS,
} from '@/interfaces';
import { Model, Document, FilterQuery, Types } from 'mongoose';
import { connectToDatabase, disconnectFromDatabase } from '../database/connection';
import { extractType } from '@/util/cast-type.util';
import { getPagination } from '@/util/getPagination';

export class MongoBaseRepository<T, D extends Document> implements IMongoRepository<T, D> {
	protected readonly model: Model<D>;
	protected searchableFields = PRODUCT_SEARCHABLE_FIELDS;
	protected filterableFields = PRODUCT_FILTERABLE_FIELDS;

	constructor(model: Model<D>, searchableFields?: string[], filterableFields?: string[]) {
		this.model = model;
		if (searchableFields) this.searchableFields = searchableFields;
		if (filterableFields) this.filterableFields = filterableFields;
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
		return this.model.find(filter || {}).exec();
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
					.skip(skip)
					.limit(limit)
					.exec()
			: [];

		return {
			data,
			pagination: getPagination(page, limit, total),
		};
	}

	async search(keyword: string, page: number, limit: number): Promise<PaginatedResult<D[]>> {
		await this.ensureConnected();
		const skip = (page - 1) * limit;

		// Xây dựng điều kiện tìm kiếm
		const query = this.generateSearchQuery(keyword);
		const total = await this.model.countDocuments(query).exec();
		const data = total ? await this.model.find(query).skip(skip).limit(limit).exec() : [];

		return {
			data,
			pagination: getPagination(page, limit, total),
		};
	}

	async filter(criteria: FilterQuery<D>, page: number, limit: number, sort?: any): Promise<PaginatedResult<D[]>> {
		await this.ensureConnected();
		const skip = (page - 1) * limit;

		// Xây dựng điều kiện lọc
		const filterableCriteria = this.generateFilterQuery(criteria);
		const total = await this.model.countDocuments(filterableCriteria).exec();

		// Thực hiện truy vấn với điều kiện lọc
		let query = this.model.find(filterableCriteria).skip(skip).limit(limit);
		if (sort) query = query.sort(sort);
		const data = total ? await query.exec() : [];
		return {
			data,
			pagination: getPagination(page, limit, total),
		};
	}

	async searchFilter(
		keyword: string = '',
		criteria: Record<string, any> = {},
		page: number,
		limit: number,
		sort?: any
	): Promise<{ data: D[]; pagination: IPagination }> {
		await this.ensureConnected();
		const skip = (page - 1) * limit;

		// Xây dựng điều kiện tìm kiếm và lọc
		const searchCondition = this.generateSearchQuery(keyword);
		const filterableCriteria: FilterQuery<D> = this.generateFilterQuery(criteria);

		// Kết hợp điều kiện tìm kiếm và lọc
		const finalQuery = { ...filterableCriteria, ...searchCondition };

		// Đếm tổng số tài liệu phù hợp với điều kiện và kiểm tra số lượng
		const total = await this.model.countDocuments(finalQuery);
		if (total === 0) {
			return {
				data: [],
				pagination: getPagination(page, limit, total),
			};
		}

		// Thực hiện truy vấn với điều kiện đã kết hợp
		let query = this.model.find(finalQuery).skip(skip).limit(limit);
		if (sort) query = query.sort(sort);
		const data = await query.exec();
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

	protected generateSearchQuery(keyword: string): FilterQuery<D> {
		if (!keyword || keyword.trim() === '') {
			return {};
		}

		return {
			$or: this.searchableFields.map((field) => ({
				[field]: { $regex: keyword.trim(), $options: 'i' },
			})) as FilterQuery<D>[],
		} as FilterQuery<D>;
	}

	protected generateFilterQuery(criteria: Record<string, any>): FilterQuery<D> {
		const filterableCriteria: Record<string, any> = {};
		for (const key of Object.keys(criteria)) {
			if ((this.filterableFields as readonly string[]).includes(key)) {
				const value = criteria[key];
				const { isArray } = extractType(value);
				filterableCriteria[key] = isArray ? { $all: value } : value;
			}
		}
		return filterableCriteria as FilterQuery<D>;
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
