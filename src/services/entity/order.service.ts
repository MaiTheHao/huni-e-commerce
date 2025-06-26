import { ICreateOrderData, IOrderDocument, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import { orderRepository } from '@/server/repositories/order.repository';
import { isEmpty } from '@/util';
import { loggerService } from '../logger.service';
import { TErrorFirst } from '@/interfaces';
import { userRepository } from '@/server/repositories/user.repository';

class OrderService {
	private static instance: OrderService;

	private constructor() {}

	static getInstance(): OrderService {
		if (!OrderService.instance) {
			OrderService.instance = new OrderService();
		}
		return OrderService.instance;
	}

	async getById(orderId: string, projection?: Record<string, any>): Promise<TErrorFirst<any, IOrderDocument | null>> {
		if (isEmpty(orderId)) {
			return ['ID đơn hàng không được để trống', null];
		}
		try {
			const order = await orderRepository.findById(orderId.trim(), projection);
			if (!order) return ['Không tìm thấy đơn hàng', null];
			return [null, order];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy thông tin đơn hàng', null];
		}
	}

	async getAllByCustomerId(customerId: string, projection?: Record<string, any>): Promise<TErrorFirst<any, IOrderDocument[]>> {
		if (isEmpty(customerId)) {
			return ['ID khách hàng không được để trống', null];
		}
		try {
			const orders = await orderRepository.findAllByCustomerId(customerId.trim(), projection);
			return [null, orders || []];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy danh sách đơn hàng', []];
		}
	}

	async getAllByCustomerIdAndStatus(customerId: string, status: TOrderStatus, projection?: Record<string, any>): Promise<TErrorFirst<any, IOrderDocument[]>> {
		if (isEmpty(customerId)) {
			return ['ID khách hàng không được để trống', null];
		}
		try {
			const orders = await orderRepository.findAllByCustomerIdAndStatus(customerId.trim(), status, projection);
			return [null, orders || []];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy danh sách đơn hàng', []];
		}
	}

	async authedCreate(orderData: ICreateOrderData & { customerId: string }): Promise<TErrorFirst<any, IOrderDocument>> {
		const isValid =
			!isEmpty(orderData.customerId) &&
			!isEmpty(orderData.customerName) &&
			!isEmpty(orderData.customerEmail) &&
			!isEmpty(orderData.customerPhone) &&
			!isEmpty(orderData.customerAddress) &&
			orderData?.items?.length > 0;

		if (!isValid) {
			return ['Thông tin đơn hàng không hợp lệ', null];
		}
		try {
			const isUserValid = await userRepository.exists({ _id: orderData.customerId!.trim() });
			if (!isUserValid) return ['Khách hàng không hợp lệ', null];

			const newOrder = await orderRepository.create({
				...orderData,
				type: 'normal',
			});

			return [null, newOrder];
		} catch (error) {
			loggerService.error('Lỗi trong quá trình tạo đơn hàng:', error);
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo đơn hàng', null];
		}
	}

	async anonymousCreate(orderData: ICreateOrderData): Promise<TErrorFirst<any, IOrderDocument>> {
		const isValid =
			!isEmpty(orderData.customerName) && !isEmpty(orderData.customerEmail) && !isEmpty(orderData.customerPhone) && !isEmpty(orderData.customerAddress) && orderData?.items?.length > 0;

		if (!isValid) {
			return ['Thông tin đơn hàng không hợp lệ', null];
		}
		try {
			const newOrder = await orderRepository.create({
				...orderData,
				type: 'anonymous',
			});

			return [null, newOrder];
		} catch (error) {
			loggerService.error('Lỗi trong quá trình tạo đơn hàng:', error);
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo đơn hàng', null];
		}
	}

	async updateStatus(orderId: string, status: TOrderStatus): Promise<TErrorFirst<any, IOrderDocument | null>> {
		if (isEmpty(orderId) || isEmpty(status)) {
			return ['ID đơn hàng và trạng thái không được để trống', null];
		}
		try {
			const updatedOrder = await orderRepository.update({ _id: orderId.trim() }, { status });
			if (!updatedOrder) return ['Cập nhật trạng thái thất bại', null];
			return [null, updatedOrder];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi cập nhật trạng thái', null];
		}
	}

	async exitstsById(orderId: string): Promise<boolean> {
		if (isEmpty(orderId)) {
			return Promise.resolve(false);
		}
		try {
			const exists = await orderRepository.exists({ _id: orderId.trim() });
			return exists;
		} catch (error) {
			loggerService.error('Lỗi trong quá trình kiểm tra sự tồn tại của đơn hàng:', error);
			return false;
		}
	}
}

export const orderService = OrderService.getInstance();
