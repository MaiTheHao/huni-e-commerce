import { TFilterCriteria, TSortCriteria, TSearchCriteria } from './filter-sort-criteria.interface';

export interface IProduct {
	_id: string;
	name: string;
	description: string;
	price: number;
	discountPercent: number;
	stock: number;
	isActive: boolean;
	images: string[];
	tags: string[];
	brand: string;
	createdAt: Date;
	updatedAt: Date;
}

export const PRODUCT_SEARCHABLE_FIELDS = ['name', 'description', 'tags'] as const;
export type ProductSearchableFields = (typeof PRODUCT_SEARCHABLE_FIELDS)[number];

export const PRODUCT_SORTABLE_FIELDS = ['name', 'price', 'discountPercent'] as const;
export type ProductSortableFields = (typeof PRODUCT_SORTABLE_FIELDS)[number];

export const PRODUCT_FILTERABLE_FIELDS = [
	'price',
	'discountPercent',
	'stock',
	'isActive',
	'tags',
	'brand',
	'createdAt',
	'updatedAt',
] as const;
export type ProductFilterableFields = (typeof PRODUCT_FILTERABLE_FIELDS)[number];

// CRITERIA TYPES
export type ProductFilterCriteria = TFilterCriteria<ProductFilterableFields>;
export type ProductSortCriteria = TSortCriteria<ProductSortableFields>;
export type ProductSearchCriteria = TSearchCriteria;
