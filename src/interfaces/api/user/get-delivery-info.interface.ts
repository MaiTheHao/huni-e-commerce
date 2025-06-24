import { IUserBase } from '../../entity/user.interface';
export interface IGetDeliveryInfoResponseData extends Pick<IUserBase, 'name' | 'email' | 'phone' | 'addresses'> {
	uid: string;
}
