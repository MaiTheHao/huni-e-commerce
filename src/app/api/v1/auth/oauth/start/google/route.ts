import { COOKIE_KEYS } from '@/consts/keys';
import { cookieService } from '@/services/cookie.service';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Xử lý yêu cầu đăng nhập với Google OAuth
 * @description Khởi tạo quy trình xác thực OAuth với Google, sau đó lưu trạng thái vào cookie để bảo vệ chống tấn công CSRF.
 * Khi người dùng truy cập URL này, họ sẽ được chuyển hướng đến trang đăng nhập của Google.
 * Sau khi đăng nhập thành công, Google sẽ chuyển hướng người dùng trở lại URL đã chỉ định trong biến môi trường `OAUTH_GOOGLE_REDIRECT_URI`.
 * @param request NextRequest
 * @returns
 */
export async function GET(request: NextRequest) {
	const state = crypto.randomBytes(16).toString('hex');
	const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.OAUTH_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
		process.env.OAUTH_GOOGLE_REDIRECT_URI!
	)}&response_type=code&scope=email%20profile&state=${state}`;

	const response = NextResponse.redirect(authUrl);
	response.cookies.set(COOKIE_KEYS.OAUTH_STATE, state, {
		httpOnly: true,
		path: '/',
		maxAge: 600, // 10 phút
	});

	return response;
}
