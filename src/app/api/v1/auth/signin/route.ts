import { ISigninRequest } from '@/interfaces/api/auth/sign-in.interface';
import { authService } from '@/services/auth/auth.service';
import { cookieService } from '@/services/cookie.service';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	let data: ISigninRequest;
	try {
		data = await req.json();
		const [error, result] = await authService.signin(data.email, data.password);

		if (error) {
			return responseService.unauthorized(error, 401);
		}

		if (!result) {
			return responseService.error('Đăng nhập thất bại', 404);
		}

		const { accessToken, refreshToken } = result;

		await cookieService.setRefreshToken(refreshToken);

		const response = responseService.success({ accessToken }, 'Đăng nhập thành công');

		return response;
	} catch (error) {
		return responseService.error('Lỗi định dạng JSON', 400);
	}
}
