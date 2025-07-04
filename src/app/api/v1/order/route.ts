import { NextRequest } from 'next/server';
import { orderService } from '@/services/entity/order.service';
import { authService } from '@/services/auth/auth.service';
import { responseService } from '@/services/response.service';

export async function DELETE(req: NextRequest) {
	let orderId: string | null = null;
	try {
		const body = await req.json();
		orderId = body.orderId;
	} catch {
		orderId = null;
	}

	if (!orderId) {
		return responseService.badRequest('Thiếu orderId');
	}

	const [authErr, userPayload] = await authService.validUser(req);
	if (authErr || !userPayload) {
		return responseService.unauthorized(authErr || 'Không xác thực được người dùng');
	}

	const isAdmin = Array.isArray(userPayload.roles) && userPayload.roles.includes('admin');
	if (isAdmin) {
		const [adminErr, adminPayload] = await authService.validAdmin(req);
		if (adminErr || !adminPayload) {
			return responseService.forbidden(adminErr || 'Không có quyền admin');
		}
	}

	if (!isAdmin) {
		const [orderErr, order] = await orderService.getById(orderId);
		if (orderErr || !order) {
			return responseService.notFound(orderErr || 'Không tìm thấy đơn hàng');
		}
		if (order.customerId !== userPayload.uid) {
			return responseService.forbidden('Bạn không có quyền xóa đơn hàng này');
		}
	}

	try {
		const deleted = await orderService.deleteById(orderId);
		if (!deleted) {
			return responseService.internalServerError('Xóa đơn hàng thất bại');
		}
		return responseService.success(null, 'Xóa đơn hàng thành công');
	} catch (error) {
		return responseService.internalServerError('Đã xảy ra lỗi khi xóa đơn hàng');
	}
}
