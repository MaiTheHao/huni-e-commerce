import mongoose from 'mongoose';
import { IOrderItem } from '@/interfaces/entity/order/order.entity';

const OrderItemSchema = new mongoose.Schema<IOrderItem>(
	{
		productId: { type: String, required: true },
		productName: { type: String, required: true },
		productImage: { type: String, required: true },
		quantity: { type: Number, required: true },
		unitPrice: { type: Number, required: true },
		subtotalPrice: { type: Number, required: true },
		discountAmount: { type: Number, required: false },
	},
	{ _id: false, timestamps: false }
);

export default OrderItemSchema;
