import { ISignUpRequest } from '@/interfaces/api/auth/sign-up.interface';
import { authService } from '@/services/auth/auth.service';
import { loggerService } from '@/services/logger.service';
import { nofiticationService } from '@/services/nofitication/nofitication.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	let body: ISignUpRequest;
	try {
		body = await req.json();

		try {
			const [error, newUser] = await authService.signup(body);
			if (error) {
				loggerService.error('Lỗi trong quá trình đăng ký:', error);
				return responseService.error(error, 400);
			}
			if (!newUser) {
				loggerService.warning('Đăng ký thất bại, không tạo được người dùng mới');
				return responseService.error('Đăng ký thất bại, không tạo được người dùng mới', 400);
			}

			// Gửi email xác thực
			const emailVerifyToken = await tokenService.signEmailVerificationToken({ email: newUser.email });
			await nofiticationService.getEmailNofiticationService().sendVerifyEmail(newUser.email, emailVerifyToken);

			// Trả về thông tin người dùng mới
			loggerService.info('Người dùng đăng ký thành công:', newUser.email);
			return responseService.success(null, 'Đăng ký thành công');
		} catch (error) {
			loggerService.error('Lỗi trong quá trình đăng ký:', error);
			return responseService.error('Đăng ký thất bại', 400, error);
		}
	} catch (error) {
		loggerService.error('Lỗi khi phân tích JSON:', error);
		return responseService.error('Định dạng JSON không hợp lệ', 400);
	}
}
