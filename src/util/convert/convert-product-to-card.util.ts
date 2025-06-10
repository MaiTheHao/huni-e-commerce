import { IProduct, IProductCard } from '@/interfaces';
import { toString } from './cast-type.util';

/**
 * Chuyển đổi IProduct thành IProductCard.
 * @param product
 * @param productType
 * @returns
 */
export function convertProductToCard(product: IProduct, productType: string): IProductCard {
	const productImages = product.images || [];
	const image = productImages.length > 0 ? productImages[0] : null;

	const response: IProductCard = {
		_id: toString(product._id),
		name: product.name,
		price: product.price,
		discountPercent: product.discountPercent,
		ctaHref: `/${productType}/${toString(product._id)}`,
		image: image ? image : undefined,
	};

	return response;
}

export function convertProductsToCards(products: IProduct[], productType: string): IProductCard[] {
	return products.map((product) => convertProductToCard(product, productType));
}
