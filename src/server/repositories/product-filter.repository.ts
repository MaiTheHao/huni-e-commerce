import { MongoBaseRepository } from './mongo-base.repository';
import { IProductFilter, IProductFilterDocument } from '@/interfaces/product-filter.interface';
import { ProductFilterModel } from '../database/schemas/product-filter.schema';
import { PaginatedResult } from '@/interfaces';

class ProductFilterRepository extends MongoBaseRepository<IProductFilter, IProductFilterDocument> {
	private static instance: ProductFilterRepository;

	private constructor() {
		super(ProductFilterModel);
	}

	static getInstance(): ProductFilterRepository {
		if (!ProductFilterRepository.instance) {
			ProductFilterRepository.instance = new ProductFilterRepository();
		}
		return ProductFilterRepository.instance;
	}

	async findByProductType(productType: string): Promise<IProductFilterDocument | null> {
		return await this.findOne({ productType: { $regex: productType, $options: 'i' } });
	}
}

export const productFilterRepository = ProductFilterRepository.getInstance();
