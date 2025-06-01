import { MongoBaseRepository } from './mongo-base.repository';
import { IProductDetailMarkdown, IProductDetailMarkdownDocument } from '@/interfaces';
import { ProductDetailMarkdownModel } from '../database/schemas/product-detail-markdown.schema';

class ProductDetailMarkdownRepository extends MongoBaseRepository<
	IProductDetailMarkdown,
	IProductDetailMarkdownDocument
> {
	private static instance: ProductDetailMarkdownRepository;

	private constructor() {
		super(ProductDetailMarkdownModel);
	}

	static getInstance(): ProductDetailMarkdownRepository {
		if (!ProductDetailMarkdownRepository.instance) {
			ProductDetailMarkdownRepository.instance = new ProductDetailMarkdownRepository();
		}
		return ProductDetailMarkdownRepository.instance;
	}

	async create(
		record: Partial<Omit<IProductDetailMarkdown, 'createdAt' | 'updatedAt'>>
	): Promise<IProductDetailMarkdownDocument> {
		await this.ensureConnected();
		const newRecord = new this.model(record);
		return newRecord.save();
	}
}

export const productDetailMarkdownRepository = ProductDetailMarkdownRepository.getInstance();
