import { orderService } from '@/services/entity/order.service';
import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';
import { authService } from '@/services/auth/auth.service';

export async function GET(req: NextRequest) {
	// Validate admin
	const [authErr] = await authService.validAdmin(req);
	if (authErr) {
		return responseService.error(authErr, 403);
	}

	const { searchParams } = new URL(req.url);
	const page = parseInt(searchParams.get('page') || '1', 10);
	const limit = parseInt(searchParams.get('limit') || '10', 10);

	// Customable
	const filter = {};
	const sort = {};

	const [err, result] = await orderService.getAllWithPagination(page, limit, filter, sort);

	if (err) {
		return responseService.error(err);
	}
	return responseService.success(result);
}
