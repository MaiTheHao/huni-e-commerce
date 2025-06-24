import { IGetDeliveryInfoResponseData } from './get-delivery-info.interface';

export interface IUpdateDeliveryInfoRequestData {
	name?: string;
	phone?: string;
	addresses?: string[];
}

export interface IUpdateDeliveryInfoResponseData extends IGetDeliveryInfoResponseData {}
