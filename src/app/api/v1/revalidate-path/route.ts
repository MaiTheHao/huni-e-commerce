import { NextRequest } from 'next/server';
import { authService } from '@/services/auth/auth.service';
import { userService } from '@/services/entity/user.service';
import { tokenService } from '@/services/token.service';
import { responseService } from '@/services/response.service';
import { loggerService } from '@/services/logger.service';
import { revalidatePath } from 'next/cache';

/**
 * @remarks
 * #### Request Body Structure
 * ```json
 * {
 *   "path": string,                // The path to revalidate. Must be a string starting with "/".
 *   "revalidateChildren": boolean  // (Optional) If true, also revalidates layout and all child segments.
 * }
 * ```
 */
export async function POST(req: NextRequest) {
	try {
		// 1. Kiểm tra xác thực (chỉ cho phép admin)
		const [authError, token] = authService.extractBearerToken(req);
		if (authError || !token) {
			loggerService.error('Authorization không hợp lệ', authError);
			return responseService.unauthorized('Không được phép revalidate');
		}

		const [verifyError, decoded] = await tokenService.verifyAccessToken(token);
		if (verifyError || !decoded) {
			loggerService.error('Xác thực access token thất bại', verifyError);
			return responseService.unauthorized('Không được phép revalidate');
		}

		const userId = decoded.uid;
		const [userError, user] = await userService.getById(userId, { roles: 1 });
		if (userError || !user) {
			loggerService.error('Không tìm thấy người dùng', userError);
			return responseService.unauthorized('Không được phép revalidate');
		}

		const isAdmin = user?.roles?.includes('admin');
		if (!isAdmin) {
			loggerService.warning(`Người dùng ${user.email} không có quyền revalidate`);
			return responseService.forbidden('Không có quyền revalidate');
		}

		// 2. Đọc và kiểm tra body
		const body = await req.json().catch(() => null);
		const path = body?.path;
		const revalidateChildren = body?.revalidateChildren === true;

		if (!path || typeof path !== 'string' || !path.startsWith('/')) {
			loggerService.error('Path không hợp lệ', path);
			return responseService.badRequest('Path không hợp lệ. Path phải là chuỗi bắt đầu bằng "/"');
		}

		// 3. Thực hiện revalidate
		try {
			// @ts-ignore
			revalidatePath?.(path);

			// Nếu revalidateChildren = true thì revalidate layout và tất cả các segment con
			if (revalidateChildren) {
				// Revalidate layout
				revalidatePath?.(`${path}`, 'layout');
			}

			loggerService.success(`Đã revalidate path: ${path}${revalidateChildren ? ' (bao gồm layout và children)' : ''}`);
			return responseService.success(null, `Đã revalidate path: ${path}${revalidateChildren ? ' (bao gồm layout và children)' : ''}`);
		} catch (revalidateError) {
			loggerService.error('Lỗi khi revalidate path', revalidateError);
			return responseService.internalServerError('Lỗi khi revalidate path', revalidateError);
		}
	} catch (err) {
		loggerService.critical('Lỗi không xác định khi revalidate', err);
		return responseService.internalServerError('Lỗi không xác định', err);
	}
}
