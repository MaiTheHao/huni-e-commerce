import { ISearchFilterOrderRequest, ISearchFilterOrdersResponse, TErrorFirst, TOrderSortCriteria, TOrderStatus } from '@/interfaces';
import api from '@/services/http-client/axios-interceptor';
import Swal from 'sweetalert2';
import { IOrder } from '@/interfaces';

function isCancelError(err: any) {
	return err?.code === 'ERR_CANCELED';
}

export async function fetchSearchFilterOrders(
	page: number = 1,
	limit: number = 15,
	filterCriteria: ISearchFilterOrderRequest['criteria'],
	sortCriteria: TOrderSortCriteria,
	keyword: string,
	signal: AbortSignal
): Promise<TErrorFirst<any, ISearchFilterOrdersResponse>> {
	try {
		const response = await api.post(
			'/order/search-filter',
			{
				page,
				limit,
				keyword,
				criteria: filterCriteria,
				sort: sortCriteria,
			} as ISearchFilterOrderRequest,
			{
				signal,
			}
		);
		return [null, response.data.data];
	} catch (err: any) {
		if (isCancelError(err)) return [null, null];
		return [err?.response?.data || err, null];
	}
}

export async function deleteOrder(order: IOrder, signal: AbortSignal): Promise<TErrorFirst<any, 'deleted' | 'canceled' | null>> {
	const result = await Swal.fire({
		title: 'Bạn có chắc chắn?',
		text: 'Hành động này không thể hoàn tác.',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Vẫn xóa!',
		cancelButtonText: 'Hủy',
	});
	if (!result.isConfirmed) {
		return [null, 'canceled'];
	}
	try {
		const response = await api.delete('/order', {
			data: { orderId: order._id },
			signal,
		});
		return [null, 'deleted'];
	} catch (err: any) {
		if (isCancelError(err)) return [null, null];
		return [err?.response?.data || err, null];
	}
}

export async function updateOrder(orderId: string, updateData: Partial<IOrder>, signal: AbortSignal): Promise<TErrorFirst<any, IOrder>> {
	try {
		const response = await api.put(`/order/${orderId}`, updateData, { signal });
		return [null, response.data.data];
	} catch (err: any) {
		if (isCancelError(err)) return [null, null];
		return [err?.response?.data || err, null];
	}
}

export async function updateOrderStatus(orderId: string, status: TOrderStatus, signal: AbortSignal): Promise<TErrorFirst<any, IOrder>> {
	try {
		const response = await api.put(`/order/${orderId}/status`, { status }, { signal });
		return [null, response.data.data];
	} catch (err: any) {
		if (isCancelError(err)) return [null, null];
		return [err?.response?.data || err, null];
	}
}

export async function fetchOrderById(orderId: string, signal: AbortSignal): Promise<TErrorFirst<any, IOrder>> {
	try {
		const response = await api.get(`order/get/${orderId}`, { signal });
		return [null, response.data.data];
	} catch (err: any) {
		if (isCancelError(err)) return [null, null];
		return [err?.response?.data || err, null];
	}
}
