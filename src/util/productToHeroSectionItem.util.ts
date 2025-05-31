import { ShowItemsHeroSectionItemProps } from '@/components/hero-section/HeroSectionItem';
import { IProduct } from '@/interfaces';
import { getProductAttributes } from './getProductAttributes.util';

export function productToHeroSectionItem(product: IProduct): ShowItemsHeroSectionItemProps {
	const productImages = product.images || [];
	const image = productImages.length > 0 ? productImages[productImages.length - 1] : null;

	const response: ShowItemsHeroSectionItemProps = {
		_id: product._id,
		name: product.name,
		price: product.price,
		attributes: getProductAttributes(product),
		cta: 'Xem chi tiết',
		ctaHref: `/product/${product._id}`,
		image: image ? image : undefined,
	};

	return response;
}

export function productsToHeroSectionItems(products: IProduct[]): ShowItemsHeroSectionItemProps[] {
	return products.map(productToHeroSectionItem);
}
