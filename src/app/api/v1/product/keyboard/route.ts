import { keyboardRepository } from '@/server/repositories';
import { toNumber } from '@/util/convert';
import { NextRequest } from 'next/server';
import { responseService } from '@/services/response.service';
import { IKeyboardDocument, IPagination } from '@/interfaces';
import { authService } from '@/services/auth/auth.service';

export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;

	const page = toNumber(searchParams.get('page'), 1);
	const limit = toNumber(searchParams.get('limit'), 1000);

	const {
		data,
		pagination,
	}: {
		data: IKeyboardDocument[];
		pagination: IPagination;
	} = await keyboardRepository.findWithPagination(page, limit);
	return responseService.success(
		{
			keyboards: data,
			pagination,
		},
		'Lấy tất cả bàn phím thành công'
	);
}
export async function DELETE(req: NextRequest) {
	let keyboardId: string | null = null;
	try {
		const body = await req.json();
		keyboardId = body.keyboardId;
	} catch {
		keyboardId = null;
	}

	if (!keyboardId) {
		return responseService.badRequest('Thiếu keyboardId');
	}

	const [authErr, adminPayload] = await authService.validAdmin(req);
	if (authErr || !adminPayload) {
		return responseService.forbidden(authErr || 'Không có quyền admin');
	}

	try {
		const deleted = await keyboardRepository.delete(keyboardId);
		if (!deleted) {
			return responseService.notFound('Không tìm thấy bàn phím hoặc xóa thất bại');
		}
		return responseService.success(null, 'Xóa bàn phím thành công');
	} catch (error) {
		return responseService.internalServerError('Đã xảy ra lỗi khi xóa bàn phím');
	}
}
