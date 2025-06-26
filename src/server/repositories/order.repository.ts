import { IOrder, IOrderDocument, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import { MongoBaseRepository } from './mongo-base.repository';
import OrderModel from '../database/schemas/order.schema';
import { FilterQuery } from 'mongoose';

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

	async findAll(filter?: FilterQuery<IOrderDocument>, projection?: Record<string, any>, sort?: Record<string, any>): Promise<IOrderDocument[]> {
		await this.ensureConnected();
		return this.model
			.find(filter || {}, projection)
			.sort(sort || { createdAt: -1 })
			.exec();
	}

	async findAllByCustomerId(customerId: string, projection?: Record<string, any>): Promise<IOrderDocument[] | null> {
		await this.ensureConnected();
		return this.findAll({ customerId }, projection, { createdAt: -1 });
	}

	async findAllByCustomerIdAndStatus(customerId: string, status: TOrderStatus, projection?: Record<string, any>): Promise<IOrderDocument[] | null> {
		await this.ensureConnected();
		return this.findAll({ customerId, status }, projection, { createdAt: -1 });
	}
}

export const orderRepository = OrderRepository.getInstance();
