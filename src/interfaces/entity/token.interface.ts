import { IResetPasswordRequest } from '../api/auth/reset-password.interface';
import { IOAuthProvider } from './oauth-provider.interface';

// * JWT Payload interfaces với JTI
export interface IRefreshTokenPayload {
	uid: string;
	jti: string; // ! Thêm JTI vào payload
	iat?: number;
	exp?: number;
}

export interface IAccessTokenPayload {
	uid: string;
	email: string;
	name: string;
	avatar: string;
	roles: string[];
	oauthProviders: IOAuthProvider[];
	jti: string; // ! Thêm JTI vào access token cũng
	iat?: number;
	exp?: number;
}

export interface IEmailVerifyTokenPayload {
	email: string;
	iat?: number;
	exp?: number;
}

export interface IResetPasswordTokenPayload extends IResetPasswordRequest {}
