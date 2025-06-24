import { IOAuthProvider } from '@/interfaces/entity';

export interface IGetProfileResponse {
	uid: string;
	email: string;
	name: string;
	avatar: string;
	roles: string[];
	oauthProviders: IOAuthProvider[];
}
