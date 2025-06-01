import { NextRequest } from 'next/server';
import { cartService } from '@/services/cart.service';
import { responseService } from '@/services/response.service';

export async function GET() {
	try {
		const cart = await cartService.getCart();
		return responseService.success({ cart }, 'Lấy giỏ hàng thành công');
	} catch (error) {
		return responseService.error('Lỗi khi lấy giỏ hàng', undefined, error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		await cartService.addItem(body);
		return responseService.success(undefined, 'Thêm sản phẩm vào giỏ hàng thành công');
	} catch (error) {
		return responseService.error('Lỗi khi thêm sản phẩm vào giỏ hàng', undefined, error);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		await cartService.updateItem(body.productId, body.quantity);
		return responseService.success(undefined, 'Cập nhật giỏ hàng thành công');
	} catch (error) {
		return responseService.error('Lỗi khi cập nhật giỏ hàng', undefined, error);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const productId = req.nextUrl.searchParams.get('productId');
		if (productId) {
			await cartService.removeItem(productId);
			return responseService.success(undefined, 'Xóa sản phẩm khỏi giỏ hàng thành công');
		}
		await cartService.clearCart();
		return responseService.success(undefined, 'Xóa toàn bộ giỏ hàng thành công');
	} catch (error) {
		return responseService.error('Lỗi khi xóa giỏ hàng', undefined, error);
	}
}
