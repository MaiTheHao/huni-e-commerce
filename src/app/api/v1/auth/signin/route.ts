import { TErrorFirst } from '@/interfaces';
import { ISigninRequest } from '@/interfaces/api/auth/sign-in.interface';
import { authService } from '@/services/auth.service';
import { cookieService } from '@/services/cookie.service';
import { responseService } from '@/services/response.service';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	let data: ISigninRequest;
	try {
		data = await req.json();
		const [error, result]: TErrorFirst<any, { accessToken: string; refreshToken: string } | null> = await authService.signin(data.email, data.password);

		if (error) {
			return responseService.error(error, 401);
		}

		if (!result) {
			return responseService.error('Đăng nhập thất bại', 404);
		}

		const { accessToken, refreshToken } = result;
		const response = responseService.success({ accessToken }, 'Đăng nhập thành công');
		await cookieService.setRefreshToken(refreshToken);

		return response;
	} catch (error) {
		return responseService.error('Invalid JSON format', 400);
	}
}
