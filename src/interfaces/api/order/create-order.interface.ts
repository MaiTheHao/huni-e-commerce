import { ICreateOrderData } from '@/interfaces/entity/order/order.entity';

export interface ICreateOrderRequestData extends Omit<ICreateOrderData, 'customerId'> {}
