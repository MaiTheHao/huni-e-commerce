import { HTTPStatus } from '@/enums/HttpStatus.enum';
import { ICreateOrderRequestData, IResponse, TErrorFirst } from '@/interfaces';
import api from '@/services/http-client/axios-interceptor';

export async function anonymousCreateOrder(reqData: ICreateOrderRequestData): Promise<TErrorFirst<any, null>> {
	try {
		const response = await api.post('order/add/anonymous', reqData);

		const isSuccess = response.status === HTTPStatus.CREATED;
		if (isSuccess) {
			return [null, null];
		} else {
			const errorData: IResponse<any> = response.data;
			return [errorData.message || 'Đã xảy ra lỗi khi tạo đơn hàng', null];
		}
	} catch (error: any) {
		return [error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi tạo đơn hàng', null];
	}
}

export async function authedCreateOrder(reqData: ICreateOrderRequestData): Promise<TErrorFirst<any, null>> {
	try {
		const response = await api.post('order/add/authed', reqData);

		const isSuccess = response.status === HTTPStatus.CREATED;
		if (isSuccess) {
			return [null, null];
		} else {
			const errorData: IResponse<any> = response.data;
			return [errorData.message, null];
		}
	} catch (error: any) {
		return [error?.response?.data?.message || error?.message || 'Đã xảy ra lỗi khi tạo đơn hàng', null];
	}
}
