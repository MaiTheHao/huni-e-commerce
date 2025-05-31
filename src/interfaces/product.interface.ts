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

// Định nghĩa các trường dưới dạng tuple const assertion
export const PRODUCT_SEARCHABLE_FIELDS = ['name', 'description', 'tags'];
export const PRODUCT_FILTERABLE_FIELDS = [
	'price',
	'discountPercent',
	'stock',
	'isActive',
	'tags',
	'brand',
	'createdAt',
	'updatedAt',
];

export type ProductSearchableField = (typeof PRODUCT_SEARCHABLE_FIELDS)[number];
export type ProductFilterableField = (typeof PRODUCT_FILTERABLE_FIELDS)[number];
