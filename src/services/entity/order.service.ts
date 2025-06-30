import { ICreateOrderData, IOrderDocument, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import { orderRepository } from '@/server/repositories/order.repository';
import { isEmpty } from '@/util';
import { loggerService } from '../logger.service';
import { IPagination, TErrorFirst } from '@/interfaces';
import { userService } from './user.service';

class OrderService {
	private static instance: OrderService;

	private constructor() {}

	static getInstance(): OrderService {
		if (!OrderService.instance) {
			OrderService.instance = new OrderService();
		}
		return OrderService.instance;
	}

	// CREATE METHODS

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

		const [userErr, user] = await userService.getById(orderData.customerId);
		if (userErr || !user) {
			return ['Khách hàng không hợp lệ', null];
		}

		try {
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

	// READ METHODS

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

	async getAll(filter?: Record<string, any>, projection?: Record<string, any>, sort?: Record<string, any>): Promise<TErrorFirst<any, IOrderDocument[]>> {
		try {
			const orders = await orderRepository.findAll(filter, projection, sort);
			return [null, orders || []];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy danh sách đơn hàng', []];
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

	async getAllWithPagination(page: number, limit: number, filter?: Record<string, any>, sort?: Record<string, any>): Promise<TErrorFirst<any, { data: IOrderDocument[]; pagination: IPagination }>> {
		if (!page || !limit) {
			return ['Thông tin phân trang không hợp lệ', null];
		}
		try {
			const result = await orderRepository.findWithPagination(page, limit, filter, sort);
			return [null, result];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi lấy danh sách đơn hàng', null];
		}
	}

	// UPDATE METHODS

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

	// UTILITY METHODS

	async setConfirmed(orderId: string): Promise<TErrorFirst<any, IOrderDocument | null>> {
		const [err, updatedOrder] = await this.updateStatus(orderId, 'confirmed');
		if (err || !updatedOrder) {
			return [err, updatedOrder];
		}
		return [null, updatedOrder];
	}

	async setPending(orderId: string): Promise<TErrorFirst<any, IOrderDocument | null>> {
		const [err, updatedOrder] = await this.updateStatus(orderId, 'pending');
		if (err || !updatedOrder) {
			return [err, updatedOrder];
		}
		return [null, updatedOrder];
	}

	async setShipped(orderId: string): Promise<TErrorFirst<any, IOrderDocument | null>> {
		const [err, updatedOrder] = await this.updateStatus(orderId, 'shipped');
		if (err || !updatedOrder) {
			return [err, updatedOrder];
		}
		return [null, updatedOrder];
	}

	async setCancelled(orderId: string): Promise<TErrorFirst<any, IOrderDocument | null>> {
		const [err, updatedOrder] = await this.updateStatus(orderId, 'cancelled');
		if (err || !updatedOrder) {
			return [err, updatedOrder];
		}
		return [null, updatedOrder];
	}

	async setDelivered(orderId: string): Promise<TErrorFirst<any, IOrderDocument | null>> {
		const [err, updatedOrder] = await this.updateStatus(orderId, 'delivered');
		if (err || !updatedOrder) {
			return [err, updatedOrder];
		}

		if (updatedOrder.customerId) {
			try {
				const [userErr, user] = await userService.getById(updatedOrder.customerId);
				if (!userErr && user) {
					await userService.updateMetrics(updatedOrder.customerId, {
						totalOrders: (user.metrics?.totalOrders || 0) + 1,
						totalAmountSpent: (user.metrics?.totalAmountSpent || 0) + updatedOrder.totalPrice,
						lastOrderDate: new Date(),
					});
				}
			} catch (e) {
				loggerService.error('Lỗi cập nhật metrics khi giao hàng:', e);
			}
		}

		return [null, updatedOrder];
	}

	async count(filter?: Record<string, any>): Promise<TErrorFirst<any, number>> {
		try {
			const total = await orderRepository.count(filter);
			return [null, total];
		} catch (error) {
			return [error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đếm số lượng đơn hàng', 0];
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
