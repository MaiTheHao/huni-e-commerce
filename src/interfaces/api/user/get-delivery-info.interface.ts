import { IUserBase } from '../../entity/user.entity';
export interface IGetDeliveryInfoResponseData extends Pick<IUserBase, 'name' | 'email' | 'phone' | 'addresses'> {
	uid: string;
}
