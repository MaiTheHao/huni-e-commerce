import { authService } from '@/services/auth/auth.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const [error, decoded] = await authService.validAdmin(req);
	if (error || !decoded) {
		loggerService.error('Xác thực admin thất bại', error);
		return responseService.unauthorized('Không được phép truy cập');
	}
	return responseService.success(null, 'Kiểm tra quyền truy cập thành công');
}
