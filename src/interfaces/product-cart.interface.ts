export interface IProductCart {
	_id: string;
	name: string;
	price: number;
	ctaHref: string;
	discountPercent?: number;
	image?: string;
}
