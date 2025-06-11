import { NextRequest } from 'next/server';
import { cartService } from '@/services/cart.service';
import { responseService } from '@/services/response.service';

export async function GET() {
	try {
		const cart = await cartService.getCart();
		return responseService.success({ cart }, 'Get cart successfully');
	} catch (error) {
		return responseService.error('Error while getting cart', undefined, error);
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		await cartService.addItem(body);
		return responseService.success(undefined, 'Add product to cart successfully');
	} catch (error) {
		return responseService.error('Error while adding product to cart', undefined, error);
	}
}

export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		await cartService.updateItem(body.productId, body.quantity);
		return responseService.success(undefined, 'Update cart successfully');
	} catch (error) {
		return responseService.error('Error while updating cart', undefined, error);
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const productId = req.nextUrl.searchParams.get('productId');
		if (productId) {
			await cartService.removeItem(productId);
			return responseService.success(undefined, 'Remove product from cart successfully');
		}
		await cartService.clearCart();
		return responseService.success(undefined, 'Clear cart successfully');
	} catch (error) {
		return responseService.error('Error while deleting cart', undefined, error);
	}
}
