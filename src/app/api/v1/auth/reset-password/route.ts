import { responseService } from '@/services/response.service';
import { loggerService } from '@/services/logger.service';
import { authService } from '@/services/auth/auth.service';
import { NextRequest } from 'next/server';
import { IResetPasswordRequest } from '@/interfaces/api/auth/reset-password.interface';
import { tokenService } from '@/services/token.service';
import { nofiticationService } from '@/services/nofitication/nofitication.service';

const emailService = nofiticationService.getEmailNofiticationService();

export async function POST(req: NextRequest) {
	let body: IResetPasswordRequest | null = null;
	try {
		body = await req.json();
	} catch (error) {
		loggerService.error('Lỗi khi phân tích body yêu cầu:', error);
		return responseService.badRequest('Yêu cầu không hợp lệ');
	}

	if (!body || !body.email) {
		return responseService.badRequest('Email là bắt buộc');
	}

	try {
		const [error] = await authService.preResetPassword(body.email, body.newPassword, body.confirmPassword);
		if (error) {
			loggerService.error('Lỗi khi xác thực thông tin đặt lại mật khẩu:', error);
			return responseService.badRequest(error);
		}

		const token = await tokenService.signResetPasswordToken(body);
		await emailService.sendResetPasswordEmail(body.email, token);
		return responseService.success(null, 'Email đặt lại mật khẩu đã được gửi thành công');
	} catch (error) {
		loggerService.error('Lỗi khi gửi thông báo email:', error);
		return responseService.error('Đã xảy ra lỗi trong quá trình gửi email đặt lại mật khẩu');
	}
}

export async function GET(req: NextRequest) {
	const token = req.nextUrl.searchParams.get('token');

	if (!token) {
		return responseService.redirectClient('/notification/reset-password/error');
	}

	const [verifyError, decoded] = await tokenService.verifyResetPasswordToken(token);

	if (verifyError) {
		loggerService.error(`Lỗi khi xác thực token: ${verifyError}`);
		return responseService.redirectClient('/notification/reset-password/error');
	}

	if (!decoded || !decoded.email) {
		return responseService.redirectClient('/notification/reset-password/error');
	}

	try {
		const [error, _] = await authService.finalResetPassword(decoded.email, decoded.newPassword);
		if (error) {
			loggerService.error('Lỗi khi đặt lại mật khẩu:', error);
			return responseService.redirectClient('/notification/reset-password/error');
		}
		return responseService.redirectClient('/notification/reset-password/success');
	} catch (error) {
		loggerService.error('Lỗi khi đặt lại mật khẩu:', error);
		return responseService.redirectClient('/notification/reset-password/error');
	}
}
