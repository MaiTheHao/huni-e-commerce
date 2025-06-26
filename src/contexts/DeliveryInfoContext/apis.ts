import api from '@/services/http-client/axios-interceptor';
import { loggerService } from '@/services/logger.service';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { IResponse } from '@/interfaces';

export async function fetchUserDeliveryInfo(): Promise<IGetDeliveryInfoResponseData | null> {
	try {
		const response = await api.get('/user/delivery-info');
		const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

		if (response.status !== 200) {
			loggerService.error('Lỗi khi lấy thông tin giao hàng:', responseData?.error);
			return null;
		}

		return responseData.data ?? null;
	} catch (error) {
		loggerService.error('Lỗi khi lấy thông tin giao hàng:', error);
		return null;
	} finally {
		loggerService.info('Đã hoàn thành việc lấy thông tin giao hàng');
	}
}
