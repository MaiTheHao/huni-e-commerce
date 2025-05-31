import { IProduct, PRODUCT_SEARCHABLE_FIELDS } from '@/interfaces';

export function getProductAttributes(product: IProduct) {
	const { discountPercent, brand, tags } = product;
	const attributes = [`Giảm ${discountPercent}%`, `Thương hiệu ${brand}`, `${tags[0] || null}`];
	return attributes;
}
