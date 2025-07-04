import { userRepository } from '@/server/repositories/user.repository';
import { authService } from '@/services/auth/auth.service';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { toString } from '@/util';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const [error, token] = authService.extractBearerToken(req);
	if (error || !token) {
		loggerService.error('Authorization không hợp lệ', error);
		return responseService.unauthorized('Không được phép truy cập');
	}

	const [verifyError, decoded] = await tokenService.verifyAccessToken(token);
	if (verifyError || !decoded) {
		loggerService.error(`Xác thực access token thất bại ${verifyError}`);
		return responseService.unauthorized('Không được phép truy cập');
	}

	const user = await userRepository.findById(decoded.uid, {
		email: 1,
		name: 1,
		avatar: 1,
		roles: 1,
		oauthProviders: 1,
	});
	if (!user) {
		loggerService.error('Không tìm thấy người dùng với ID', decoded.uid);
		return responseService.notFound('Không tìm thấy người dùng');
	}

	return responseService.success(
		{
			uid: toString(user._id),
			email: user.email,
			name: user.name,
			avatar: user.avatar || '',
			roles: user.roles || [],
			oauthProviders: user.oauthProviders || [],
		},
		'Lấy thông tin người dùng thành công'
	);
}

export async function DELETE(req: NextRequest) {
	let id: string | null = null;
	try {
		const body = await req.json();
		id = body.id;
	} catch {
		id = null;
	}

	if (!id) {
		return responseService.badRequest('Thiếu id');
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
		const [getErr, user] = await userService.getById(id);
		if (getErr || !user) {
			return responseService.notFound('Không tìm thấy người dùng');
		}

		// Đảm bảo chỉ được xóa chính mình
		if (userPayload.uid !== id || userPayload.uid !== user._id.toString()) {
			return responseService.forbidden('Bạn không có quyền xóa người dùng này');
		}
	}

	try {
		const deleted = await userRepository.delete(id);
		if (!deleted) {
			return responseService.notFound('Không tìm thấy người dùng hoặc xóa thất bại');
		}
		return responseService.success(null, 'Xóa người dùng thành công');
	} catch (error) {
		return responseService.internalServerError('Đã xảy ra lỗi khi xóa người dùng');
	}
}
