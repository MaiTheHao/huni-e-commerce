export interface ICartItem {
	productId: string;
	quantity: number;
	price: number;
	name: string;
	image?: string;
	discountPercent?: number;
}

export interface ICart {
	items: ICartItem[];
}

export type CartItem = ICartItem;
export type Cart = ICart;
