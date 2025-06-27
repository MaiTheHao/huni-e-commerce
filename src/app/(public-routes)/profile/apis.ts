import api from '@/services/http-client/axios-interceptor';
import { IResponse, TErrorFirst } from '@/interfaces';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { IUpdateDeliveryInfoRequestData } from '@/interfaces/api/user/update-delivery-info.interface';
import { IAddDeliveryAddressRequestData } from '@/interfaces/api/user/add-delivery-address.interface';
import { HTTPStatus } from '@/enums/HttpStatus.enum';
import { IOrder, TOrderStatus } from '@/interfaces/entity/order/order.entity';

// info Cập nhật thông tin hồ sơ (tên, số điện thoại)
export async function updateProfileInfo(data: IUpdateDeliveryInfoRequestData): Promise<TErrorFirst<any, IGetDeliveryInfoResponseData>> {
	try {
		const response = await api.post<IResponse<IGetDeliveryInfoResponseData>>('/user/delivery-info', data);
		const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;
		if (response.status !== HTTPStatus.OK) {
			return [responseData.message || 'Không thể cập nhật thông tin giao hàng', null];
		}
		const deliveryInfo: IGetDeliveryInfoResponseData = responseData.data as IGetDeliveryInfoResponseData;
		return [null, deliveryInfo];
	} catch (error: any) {
		return [error?.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin giao hàng', null];
	}
}

// info Lấy thông tin địa chỉ giao hàng của người dùng
export async function addDeliveryAddress(data: IAddDeliveryAddressRequestData): Promise<TErrorFirst<any, IGetDeliveryInfoResponseData>> {
	try {
		const response = await api.post<IResponse<IGetDeliveryInfoResponseData>>('/user/delivery-info/address/add', data);
		const responseData = response.data;
		if (response.status !== HTTPStatus.OK) {
			return [responseData.message || 'Không thể thêm địa chỉ giao hàng', null];
		}
		if (!responseData.data) {
			return ['Thông tin giao hàng không hợp lệ', null];
		}
		return [null, responseData.data];
	} catch (error: any) {
		return [error?.response?.data?.message || 'Đã xảy ra lỗi khi thêm địa chỉ giao hàng', null];
	}
}

// info Cập nhật danh sách địa chỉ giao hàng (bao gồm sửa, xóa, đặt mặc định)
export async function updateDeliveryAddresses(data: IUpdateDeliveryInfoRequestData): Promise<TErrorFirst<any, IGetDeliveryInfoResponseData>> {
	try {
		const response = await api.post<IResponse<IGetDeliveryInfoResponseData>>('/user/delivery-info/address/update', data);
		const responseData = response.data;
		if (!responseData.data) {
			return ['Thông tin giao hàng không hợp lệ', null];
		}
		if (response.status !== HTTPStatus.OK) {
			return [responseData.message || 'Không thể cập nhật địa chỉ giao hàng', null];
		}
		return [null, responseData.data];
	} catch (error: any) {
		return [error?.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật địa chỉ giao hàng', null];
	}
}

// info Lấy danh sách đơn hàng của người dùng (mới nhất)
export async function getUserOrders(status?: TOrderStatus): Promise<TErrorFirst<any, IOrder[]>> {
	try {
		const response = await api.get<IResponse<IOrder[]>>(`order/get/get-all-by-user${status ? `/${status}` : ''}`);
		const responseData = response.data;
		if (response.status !== HTTPStatus.OK) {
			return [responseData.message || 'Không thể lấy danh sách đơn hàng', null];
		}
		if (!responseData.data) {
			return ['Không có đơn hàng nào', null];
		}
		return [null, responseData.data];
	} catch (error: any) {
		return [error?.response?.data?.message || 'Đã xảy ra lỗi khi lấy danh sách đơn hàng', null];
	}
}

// info Lấy chi tiết đơn hàng theo orderId
export async function getOrderDetail(orderId: string): Promise<TErrorFirst<any, IOrder>> {
	try {
		const response = await api.get<IResponse<IOrder>>(`/order/get/${orderId}`);
		const responseData = response.data;
		if (!responseData?.data) {
			return ['Không tìm thấy đơn hàng', null];
		}
		return [null, responseData.data];
	} catch (error: any) {
		return [error?.response?.data?.message || 'Đã xảy ra lỗi khi lấy chi tiết đơn hàng', null];
	}
}
