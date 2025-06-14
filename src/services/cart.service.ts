import { cookieService } from '@/services/cookie.service';
import { responseService } from './response.service';
import { ICart, ICartItem } from '@/interfaces';

const CART_COOKIE_NAME = 'cart';

class CartService {
	private static instance: CartService;

	private constructor() {}

	static getInstance(): CartService {
		if (!CartService.instance) {
			CartService.instance = new CartService();
		}
		return CartService.instance;
	}

	async getCart(): Promise<ICart> {
		try {
			const cart = await cookieService.getJson<ICart>(CART_COOKIE_NAME);
			return cart ?? { items: [] };
		} catch (error) {
			responseService.error('Lỗi khi lấy giỏ hàng', undefined, error);
			return { items: [] };
		}
	}

	async addItem(item: ICartItem): Promise<void> {
		try {
			const cart = await this.getCart();
			const existingItem = cart.items.find((i) => i.productId === item.productId);
			if (existingItem) {
				existingItem.quantity += item.quantity;
			} else {
				cart.items.push(item);
			}
			await cookieService.setJson(CART_COOKIE_NAME, cart);
		} catch (error) {
			responseService.error('Lỗi khi thêm sản phẩm vào giỏ hàng', undefined, error);
		}
	}

	async updateItem(productId: string, quantity: number): Promise<void> {
		try {
			const cart = await this.getCart();
			const item = cart.items.find((i) => i.productId === productId);
			if (item) {
				item.quantity = quantity;
				if (item.quantity <= 0) {
					cart.items = cart.items.filter((i) => i.productId !== productId);
				}
				await cookieService.setJson(CART_COOKIE_NAME, cart);
			}
		} catch (error) {
			responseService.error('Lỗi khi cập nhật sản phẩm trong giỏ hàng', undefined, error);
		}
	}

	async removeItem(productId: string): Promise<void> {
		try {
			const cart = await this.getCart();
			cart.items = cart.items.filter((i) => i.productId !== productId);
			await cookieService.setJson(CART_COOKIE_NAME, cart);
		} catch (error) {
			responseService.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng', undefined, error);
		}
	}

	async clearCart(): Promise<void> {
		try {
			await cookieService.delete(CART_COOKIE_NAME);
		} catch (error) {
			responseService.error('Lỗi khi xóa toàn bộ giỏ hàng', undefined, error);
		}
	}
}

export const cartService = CartService.getInstance();
