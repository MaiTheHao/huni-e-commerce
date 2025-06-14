import { userRepository } from '@/server/repositories/user.repository';
import { loggerService } from '@/services/logger.service';
import { nofiticationService } from '@/services/nofitication/nofitication.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { NextRequest } from 'next/server';

const emailService = nofiticationService.getEmailNofiticationService();

export async function POST(req: NextRequest) {
	let body: { email: string } | null = null;
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
		const token = await tokenService.signEmailVerificationToken({ email: body.email });
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
		return responseService.badRequest('Token là bắt buộc');
	}

	const [verifyError, decoded] = await tokenService.verifyEmailVerificationToken<{ email: string }>(token);

	if (verifyError) {
		loggerService.error(`Lỗi khi xác thực token: ${verifyError}`);
		return responseService.sendHtml(emailService.getVerifyErrorHtml());
	}

	if (!decoded) {
		return responseService.badRequest('Token là bắt buộc');
	}

	const user = await userRepository.findByEmail(decoded.email);
	if (!user) {
		return responseService.notFound('Người dùng không tồn tại');
	}

	if (user.isEmailVerified) {
		return responseService.sendHtml(emailService.getAlreadyVerifiedHtml());
	}

	try {
		await userRepository.update({ _id: user.id }, { isEmailVerified: true });
	} catch (error) {
		loggerService.error('Lỗi khi xác thực email:', error);
		return responseService.sendHtml(emailService.getVerifyErrorHtml());
	}

	return responseService.sendHtml(emailService.getVerifySuccessHtml());
}
