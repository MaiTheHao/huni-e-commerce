'use client';
import { ICartItem, IProduct } from '@/interfaces';
import { createContext } from 'react';

interface ICartContext {
	items: ICartItem[];
	products: Record<string, IProduct | null>;
	setItems: (items: ICartItem[]) => void;
	setProducts: (products: Record<string, IProduct | null>) => void;
	loading: boolean;
	fetchCart: () => Promise<void>;
	handleRemove: (productId: string) => Promise<void>;
	handleRemoveAll: () => Promise<void>;
	handleQuantity: (productId: string, quantity: number) => Promise<void>;
	handleAddToCart: (productId: string, quantity?: number) => Promise<void>;
}

const CartContext = createContext<ICartContext>({
	items: [],
	products: {},
	setItems: () => {},
	setProducts: () => {},
	loading: false,
	fetchCart: async () => {},
	handleRemove: async () => {},
	handleRemoveAll: async () => {},
	handleQuantity: async () => {},
	handleAddToCart: async () => {},
});

export default CartContext;
