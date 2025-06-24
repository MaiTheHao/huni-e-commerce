import { IGetDeliveryInfoResponseData } from './get-delivery-info.interface';

export interface IAddDeliveryAddressRequestData {
	address: string;
}

export interface IAddDeliveryAddressResponseData extends IGetDeliveryInfoResponseData {}
