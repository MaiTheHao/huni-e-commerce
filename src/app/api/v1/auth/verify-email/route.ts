import { IEmailVerifyTokenPayload } from '@/interfaces';
import { userRepository } from '@/server/repositories/user.repository';
import { loggerService } from '@/services/logger.service';
import { nofiticationService } from '@/services/nofitication/nofitication.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { NextRequest } from 'next/server';

const emailService = nofiticationService.getEmailNofiticationService();

export async function POST(req: NextRequest) {
	let body: IEmailVerifyTokenPayload | null = null;
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
		const token = await tokenService.signEmailVerificationToken(body);
		await emailService.sendVerifyEmail(body.email, token);
		return responseService.success(null, 'Email xác thực đã được gửi thành công');
	} catch (error) {
		loggerService.error('Lỗi khi gửi thông báo email:', error);
		return responseService.error('Đã xảy ra lỗi trong quá trình gửi email xác thực');
	}
}
export async function GET(req: NextRequest) {
	const token = req.nextUrl.searchParams.get('token');

	if (!token) {
		return responseService.redirectClient('/notification/email-verification/error');
	}

	const [verifyError, decoded] = await tokenService.verifyEmailVerificationToken(token);

	if (verifyError) {
		loggerService.error(`Lỗi khi xác thực token: ${verifyError}`);
		return responseService.redirectClient('/notification/email-verification/error');
	}

	if (!decoded) {
		return responseService.redirectClient('/notification/email-verification/error');
	}

	const user = await userRepository.findByEmail(decoded.email);
	if (!user) {
		return responseService.redirectClient('/notification/email-verification/error');
	}

	if (user.isEmailVerified) {
		return responseService.redirectClient('/notification/email-verification/already-verified');
	}

	try {
		await userRepository.update({ _id: user.id }, { isEmailVerified: true });
		return responseService.redirectClient('/notification/email-verification/success');
	} catch (error) {
		loggerService.error('Lỗi khi xác thực email:', error);
		return responseService.redirectClient('/notification/email-verification/error');
	}
}
