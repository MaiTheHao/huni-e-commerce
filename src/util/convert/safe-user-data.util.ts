import { IUserDocument } from '@/interfaces';
import { toString } from './cast-type.util';

interface IgetSafeUserData {
	uid: string;
	email: string;
	name: string;
	avatar?: string;
	roles?: string[];
}
export const getSafeUserData = (user: IUserDocument): IgetSafeUserData => {
	return {
		uid: toString(user._id),
		email: user.email,
		name: user.name,
		avatar: user.avatar,
		roles: user.roles,
	};
};
