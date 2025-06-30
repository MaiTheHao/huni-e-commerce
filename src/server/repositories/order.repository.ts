import { IOrder, IOrderDocument, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import { MongoBaseRepository } from './mongo-base.repository';
import OrderModel from '../database/schemas/order.schema';

class OrderRepository extends MongoBaseRepository<IOrder, IOrderDocument> {
	private static instance: OrderRepository;

	private constructor() {
		super(OrderModel);
	}

	static getInstance(): OrderRepository {
		if (!OrderRepository.instance) {
			OrderRepository.instance = new OrderRepository();
		}
		return OrderRepository.instance;
	}

	async findAllByCustomerId(customerId: string, projection?: Record<string, any>): Promise<IOrderDocument[] | null> {
		await this.ensureConnected();
		return this.findAll({ customerId }, projection, { _id: -1 });
	}

	async findAllByCustomerIdAndStatus(customerId: string, status: TOrderStatus, projection?: Record<string, any>): Promise<IOrderDocument[] | null> {
		await this.ensureConnected();
		return this.findAll({ customerId, status }, projection, { _id: -1 });
	}
}

export const orderRepository = OrderRepository.getInstance();
