import { IMongoRepository, IProduct } from '@/interfaces';
import { keyboardRepository } from './keyboard.repository';
import { Document } from 'mongoose';

export * from './keyboard.repository';
export * from './hero-section.repository';
export * from './product-detail-markdown.repository';
export * from './product-filter.repository';

export const PRODUCT_REPOSITORIES: { [key: string]: IMongoRepository<IProduct, Document> } = {
	keyboard: keyboardRepository,
};
