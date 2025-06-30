import { orderService } from '@/services/entity/order.service';
import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';
import { authService } from '@/services/auth/auth.service';

export async function GET(req: NextRequest) {
	// Validate admin
	const [authErr] = await authService.validAdmin(req);
	if (authErr) {
		return responseService.error(authErr, 401);
	}

	const { searchParams } = new URL(req.url);
	let filter: Record<string, any> = {};
	let sort: Record<string, any> = {};

	const filterParam = searchParams.get('filter');
	const sortParam = searchParams.get('sort');

	if (filterParam) {
		try {
			filter = JSON.parse(filterParam);
		} catch {
			return responseService.error('Tham số filter không hợp lệ');
		}
	}

	if (sortParam) {
		try {
			sort = JSON.parse(sortParam);
		} catch {
			return responseService.error('Tham số sort không hợp lệ');
		}
	}

	const [err, result] = await orderService.getAll(filter, undefined, sort);
	if (err) {
		return responseService.error(err);
	}
	return responseService.success(result);
}
