import { IUserDocument, TErrorFirst } from '@/interfaces';
import { ISignUpRequest } from '@/interfaces/api/auth/sign-up.interface';
import { userRepository } from '@/server/repositories/user.repository';
import { isEmpty, toString } from '@/util';
import { comparePassword, generateSalt, hashPassword } from '@/util/hash.util';
import { tokenService } from './token.service';
import { loggerService } from './logger.service';
import { NextRequest } from 'next/server';

class AuthService {
	private static instance: AuthService;

	private constructor() {}

	public static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

	extractBearerToken(req: NextRequest): TErrorFirst<any, string | null> {
		const authHeader = req.headers.get('authorization');
		if (!authHeader) return ['Không tồn tại header authorization', null];
		const parts = authHeader.split(' ');
		if (parts.length !== 2 || parts[0] !== 'Bearer') return ['Header Authorization không hợp lệ', null];
		return [null, parts[1]];
	}

	async signup(user: ISignUpRequest): Promise<TErrorFirst<any, IUserDocument>> {
		if (isEmpty(user.email) || isEmpty(user.name) || isEmpty(user.password) || isEmpty(user.confirmPassword)) {
			return ['Chưa nhập đủ thông tin', null];
		}

		if (user.password.trim() !== user.confirmPassword.trim()) {
			return ['Mật khẩu và xác nhận mật khẩu không khớp', null];
		}

		try {
			const existing = (await userRepository.count({ email: user.email.trim() })) > 0;
			if (existing) return ['Người dùng với email này đã tồn tại', null];

			const salt = generateSalt();
			const hashedPassword = hashPassword(user.password, salt);
			const newUser = await userRepository.signup(user.email.trim(), user.name.trim(), hashedPassword, salt);
			return [null, newUser];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đăng ký', null];
		}
	}

	async signin(email: string, password: string): Promise<TErrorFirst<any, { accessToken: string; refreshToken: string } | null>> {
		if (isEmpty(email) || isEmpty(password)) {
			return ['Email và mật khẩu là bắt buộc', null];
		}
		try {
			const user = await userRepository.findByEmail(email.trim());
			if (!user) return ['Không tìm thấy người dùng', null];
			if (!user.isEmailVerified) return ['Email chưa được xác minh', null];

			const isPasswordValid = comparePassword(password.trim(), user.salt, user.password);
			if (!isPasswordValid) return ['Tài khoản hoặc mật khẩu không đúng', null];

			const { accessToken, refreshToken } = {
				accessToken: await tokenService.signAccessToken({ uid: toString(user._id) }),
				refreshToken: await tokenService.signRefreshToken({ uid: toString(user._id) }),
			};
			return [null, { accessToken, refreshToken }];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đăng nhập', null];
		}
	}

	async getProfile(userId: string, accessToken: string): Promise<TErrorFirst<any, IUserDocument | null>> {
		if (isEmpty(userId) || isEmpty(accessToken)) {
			return ['Không đầy đủ thông tin cần thiết', null];
		}

		try {
			const [err, decoded] = await tokenService.verifyAccessToken(accessToken);

			if (err) {
				loggerService.error('Error verifying access token:', err);
				return ['Phiên người dùng không hợp lệ', null];
			}
			const user = await userRepository.findById(userId);
			if (!user) return ['Không tìm thấy người dùng', null];

			return [null, user];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng', null];
		}
	}
}

export const authService = AuthService.getInstance();
