import { NextRequest, NextResponse } from 'next/server';
import { loggerService } from '@/services/logger.service';
import { IGoogleOAuthUserData } from '@/interfaces/oauth/google-oauth.interface';
import { COOKIE_KEYS } from '@/consts/keys';
import { responseService } from '@/services/response.service';
import { authService } from '@/services/auth/auth.service';
import { tokenService } from '@/services/token.service';
import { toString } from '@/util';
import { cookieService } from '@/services/cookie.service';
import { HTTPStatus } from '@/enums/HttpStatus.enum';

/**
 * Xử lý callback từ Google OAuth
 */
const successUrl = `/notification/oauth/success`;
const errorUrl = `/notification/oauth/error`;
export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const code = searchParams.get('code');
	const state = searchParams.get('state');
	const cookieState = request.cookies.get('oauth_state')?.value;

	if (state !== cookieState) {
		loggerService.error('State không khớp', { state, cookieState });
		return responseService.redirectClient(errorUrl, HTTPStatus.SEE_OTHER);
	}

	// Trao đổi mã xác thực lấy access token từ Google
	const tokenUrl = 'https://oauth2.googleapis.com/token';
	const params = new URLSearchParams({
		client_id: process.env.OAUTH_GOOGLE_CLIENT_ID!,
		client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
		code: code ?? '',
		redirect_uri: process.env.OAUTH_GOOGLE_REDIRECT_URI!,
		grant_type: 'authorization_code',
	});

	const tokenRes = await fetch(tokenUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params,
	});

	const tokenData = await tokenRes.json();

	if (tokenRes.status !== 200 || !tokenData.access_token) {
		loggerService.error('Không lấy được access token từ Google', { status: tokenRes.status, tokenData });
		return responseService.redirectClient(errorUrl, HTTPStatus.SEE_OTHER);
	}

	// Lấy thông tin người dùng từ Google
	const userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';

	const userRes = await fetch(userInfoUrl, {
		headers: { Authorization: `Bearer ${tokenData.access_token}` },
	});
	const userData: IGoogleOAuthUserData = await userRes.json();

	if (!userData.email) {
		loggerService.error('Không tìm thấy email trong thông tin người dùng', userData);
		return responseService.redirectClient(errorUrl, HTTPStatus.SEE_OTHER);
	}

	// Tích hợp với logic xác thực của hệ thống
	const [authErr, user] = await authService.authWithGoogleOAuthUserData(userData);
	// Xóa cookie state để bảo vệ chống tấn công CSRF
	request.cookies.delete(COOKIE_KEYS.OAUTH_STATE);

	if (authErr || !user) {
		loggerService.error('Lỗi xác thực với Google OAuth', authErr);
		return responseService.redirectClient(errorUrl, HTTPStatus.SEE_OTHER);
	}

	// Tạo access token và refresh token cho hệ thống
	const accessToken = await tokenService.signAccessToken({
		uid: toString(user._id),
		email: user.email,
		name: user.name,
		avatar: user.avatar,
		roles: user.roles,
		oauthProviders: user.oauthProviders,
	});

	const refreshToken = await tokenService.signRefreshToken({
		uid: toString(user._id),
	});

	// Lưu refresh token vào cookie httpOnly
	await cookieService.setRefreshToken(refreshToken);

	// Lưu access token vào temporary cookie (5 phút)
	await cookieService.setJson(COOKIE_KEYS.TMP_ACCESS_TOKEN, accessToken, {
		httpOnly: false,
		maxAge: 5 * 60, // 5 phút
	});

	// Chuyển hướng đến success page
	return responseService.redirectClient(successUrl, HTTPStatus.SEE_OTHER);
}
