export interface ICartItem {
	productId: string;
	quantity: number;
}

export interface ICart {
	items: ICartItem[];
}
