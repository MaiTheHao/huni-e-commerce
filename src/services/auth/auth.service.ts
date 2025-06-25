import { IUserDocument, TErrorFirst } from '@/interfaces';
import { ISignUpRequest } from '@/interfaces/api/auth/sign-up.interface';
import { userService } from '../entity/user.service';
import { isEmpty, toString } from '@/util';
import { comparePassword, generateSalt, hashPassword } from '@/util/hash.util';
import { tokenService } from '../token.service';
import { loggerService } from '../logger.service';
import { NextRequest } from 'next/server';
import { cookieService } from '../cookie.service';
import { IGoogleOAuthUserData } from '@/interfaces/oauth/google-oauth.interface';
import { ISigninResponseData } from '@/interfaces/api/auth/sign-in.interface';

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
			const existed = await userService.existsByEmail(user.email.trim());
			if (existed) return ['Người dùng với email này đã tồn tại', null];

			const salt = generateSalt();
			const hashedPassword = hashPassword(user.password, salt);
			const [err, newUser] = await userService.create({
				email: user.email.trim(),
				name: user.name.trim(),
				password: hashedPassword,
				salt,
			});
			if (err) return [err, null];
			return [null, newUser];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đăng ký', null];
		}
	}

	async signin(email: string, password: string): Promise<TErrorFirst<any, ISigninResponseData & { refreshToken: string }>> {
		if (isEmpty(email) || isEmpty(password)) {
			return ['Email và mật khẩu là bắt buộc', null];
		}
		try {
			const [err, user] = await userService.getByEmail(email.trim());
			if (err || !user) return [err || 'Không tìm thấy người dùng', null];
			if (!user.isEmailVerified) return ['Email chưa được xác minh', null];

			const isPasswordValid = comparePassword(password.trim(), user.salt, user.password);
			if (!isPasswordValid) return ['Tài khoản hoặc mật khẩu không đúng', null];

			const { accessToken, refreshToken } = {
				accessToken: await tokenService.signAccessToken({
					uid: toString(user._id),
					email: user.email,
					name: user.name,
					avatar: user.avatar,
					roles: user.roles,
					oauthProviders: user.oauthProviders,
				}),
				refreshToken: await tokenService.signRefreshToken({ uid: toString(user._id) }),
			};
			return [null, { accessToken, refreshToken }];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đăng nhập', null];
		}
	}

	async logout(): Promise<TErrorFirst<any, null>> {
		try {
			await cookieService.deleteRefreshToken();
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đăng xuất', null];
		}

		return [null, null];
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
			const [userErr, user] = await userService.getById(userId);
			if (userErr || !user) return [userErr || 'Không tìm thấy người dùng', null];

			return [null, user];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng', null];
		}
	}

	async preResetPassword(email: string, newPassword: string, confirmPassword: string): Promise<TErrorFirst<any, null>> {
		if (isEmpty(email) || isEmpty(newPassword) || isEmpty(confirmPassword)) {
			return ['Thông tin không đầy đủ', null];
		}

		if (newPassword.trim() !== confirmPassword.trim()) {
			return ['Mật khẩu không khớp', null];
		}

		try {
			const hasUser = await userService.existsByEmail(email.trim());
			if (!hasUser) return ['Không tìm thấy người dùng với email này', null];

			const [error, user] = await userService.getByEmail(email.trim());
			if (error) return [error, null];
			if (comparePassword(newPassword.trim(), user!.salt, user!.password)) return ['Mật khẩu mới không được giống với mật khẩu cũ', null];
			return [null, null];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đặt lại mật khẩu', null];
		}
	}

	async finalResetPassword(email: string, newPassword: string): Promise<TErrorFirst<any, IUserDocument | null>> {
		// Đảm bảo đã chạy preResetPassword trước khi gọi hàm này
		try {
			const newSalt = generateSalt();
			const [err] = await userService.updatePasswordByEmail(email.trim(), hashPassword(newPassword.trim(), newSalt), newSalt);
			if (err) return [err, null];
			return [null, null];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình đặt lại mật khẩu', null];
		}
	}

	async authWithGoogleOAuthUserData(userData: IGoogleOAuthUserData): Promise<TErrorFirst<any, IUserDocument | null>> {
		try {
			// Kiểm tra xem người dùng đã tồn tại chưa
			const [err, existingUser] = await userService.getByEmail(userData.email);

			// info Kiểm tra xem người dùng có tồn tại hay không hoặc có lỗi xảy ra
			if (!err && existingUser) {
				// Người dùng đã tồn tại, kiểm tra xem đã kết nối với Google hay chưa
				const oauthProviders = existingUser.oauthProviders || [];
				const googleProvider = oauthProviders.find((provider) => provider.providerName.trim() === 'google' && provider.providerId.trim() === userData.id);

				// Kiểm tra xem người dùng đã kết nối với Google hay chưa
				if (!googleProvider) {
					// Chưa kết nối với Google, thêm mới
					const [updateErr, updatedUser] = await userService.updateProfile(toString(existingUser._id), {
						oauthProviders: [
							...oauthProviders,
							{
								providerName: 'google',
								providerId: userData.id,
							},
						],
						isEmailVerified: true,
					});

					if (updateErr) {
						loggerService.error('Lỗi cập nhật thông tin Google cho người dùng:', updateErr);
						return [updateErr, null];
					}

					return [null, updatedUser];
				}

				// Người dùng đã tồn tại và đã kết nối với Google, trả về người dùng hiện tại
				return [null, existingUser];
			} else {
				// Người dùng chưa tồn tại, tạo mới người dùng
				const [createErr, newUser] = await userService.create({
					email: userData.email,
					name: userData.name,
					avatar: userData.picture,
					oauthProviders: [
						{
							providerName: 'google',
							providerId: userData.id,
						},
					],
					isEmailVerified: true, // Luôn xác thực email với OAuth
				});

				if (createErr) {
					loggerService.error('Lỗi tạo người dùng từ Google OAuth:', createErr);
					return [createErr, null];
				}

				return [null, newUser];
			}
		} catch (error) {
			loggerService.error('Lỗi xác thực với Google OAuth:', error);
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi trong quá trình xác thực Google', null];
		}
	}
}

export const authService = AuthService.getInstance();
