import { Cart, CartItem } from '@/interfaces/cart.interface';
import { getJsonCookie, setJsonCookie, deleteCookie } from '../util/cookie';
import { responseService } from './response.service';

const CART_COOKIE_NAME = 'cart';

class CartService {
	private static instance: CartService;

	private constructor() {}

	static getInstance() {
		if (!CartService.instance) {
			CartService.instance = new CartService();
		}
		return CartService.instance;
	}

	async getCart(): Promise<Cart> {
		try {
			const cart = await getJsonCookie<Cart>(CART_COOKIE_NAME);
			return cart || { items: [] };
		} catch (error) {
			responseService.error('Lỗi khi lấy giỏ hàng', undefined, error);
			return { items: [] };
		}
	}

	async addItem(item: CartItem): Promise<void> {
		try {
			const cart = await this.getCart();
			const idx = cart.items.findIndex((i: CartItem) => i.productId === item.productId);
			if (idx > -1) {
				cart.items[idx].quantity += item.quantity;
			} else {
				cart.items.push(item);
			}
			await setJsonCookie(CART_COOKIE_NAME, cart);
		} catch (error) {
			responseService.error('Lỗi khi thêm sản phẩm vào giỏ hàng', undefined, error);
		}
	}

	async updateItem(productId: string, quantity: number): Promise<void> {
		try {
			const cart = await this.getCart();
			const idx = cart.items.findIndex((i: CartItem) => i.productId === productId);
			if (idx > -1) {
				cart.items[idx].quantity = quantity;
				if (cart.items[idx].quantity <= 0) {
					cart.items.splice(idx, 1);
				}
				await setJsonCookie(CART_COOKIE_NAME, cart);
			}
		} catch (error) {
			responseService.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng', undefined, error);
		}
	}

	async removeItem(productId: string): Promise<void> {
		try {
			const cart = await this.getCart();
			cart.items = cart.items.filter((i: CartItem) => i.productId !== productId);
			await setJsonCookie(CART_COOKIE_NAME, cart);
		} catch (error) {
			responseService.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng', undefined, error);
		}
	}

	async clearCart(): Promise<void> {
		try {
			await deleteCookie(CART_COOKIE_NAME);
		} catch (error) {
			responseService.error('Lỗi khi xóa toàn bộ giỏ hàng', undefined, error);
		}
	}
}

export const cartService = CartService.getInstance();
