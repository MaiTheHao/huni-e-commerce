export interface ISigninRequest {
	email: string;
	password: string;
}

export interface ISigninResponse {
	accessToken: string;
}
