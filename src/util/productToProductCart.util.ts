import { IProduct, IProductCart } from '@/interfaces';

export function productToProductCart(product: IProduct, productType: string): IProductCart {
	const productImages = product.images || [];
	const image = productImages.length > 0 ? productImages[0] : null;

	const response: IProductCart = {
		_id: product._id,
		name: product.name,
		price: product.price,
		discountPercent: product.discountPercent,
		ctaHref: `/${productType}/${product._id}`,
		image: image ? image : undefined,
	};

	return response;
}

export function productsToProductCarts(products: IProduct[], productType: string): IProductCart[] {
	return products.map((product) => productToProductCart(product, productType));
}
