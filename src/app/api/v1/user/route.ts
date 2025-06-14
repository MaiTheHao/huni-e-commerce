import { userRepository } from '@/server/repositories/user.repository';
import { authService } from '@/services/auth.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
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

	const user = await userRepository.findById(decoded.uid);
	if (!user) {
		loggerService.error('Không tìm thấy người dùng với ID', decoded.uid);
		return responseService.unauthorized('Không được phép truy cập');
	}

	return responseService.success(user, 'Lấy thông tin người dùng thành công');
}
