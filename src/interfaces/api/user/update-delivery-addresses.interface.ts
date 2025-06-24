import { IGetDeliveryInfoResponseData } from './get-delivery-info.interface';

export interface IUpdateDeliveryAddressesRequestData {
	addresses: string[];
}

export interface IUpdateDeliveryAddressesResponseData extends IGetDeliveryInfoResponseData {}
