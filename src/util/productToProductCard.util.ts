import { IProduct, IProductCard } from '@/interfaces';

export function productToProductCard(product: IProduct, productType: string): IProductCard {
	const productImages = product.images || [];
	const image = productImages.length > 0 ? productImages[0] : null;

	const response: IProductCard = {
		_id: product._id,
		name: product.name,
		price: product.price,
		discountPercent: product.discountPercent,
		ctaHref: `/${productType}/${product._id}`,
		image: image ? image : undefined,
	};

	return response;
}

export function productsToProductCards(products: IProduct[], productType: string): IProductCard[] {
	return products.map((product) => productToProductCard(product, productType));
}
