import mongoose from 'mongoose';
import { IOrderBase, ORDER_PAYMENT_METHODS, ORDER_STATUS, ORDER_TYPES } from '@/interfaces/entity/order/order.entity';
import OrderItemSchema from './sub-schemas/order-item.schema';

const OrderSchema = new mongoose.Schema<IOrderBase>({
	customerId: { type: String, required: false, default: null },
	customerName: { type: String, required: true },
	customerEmail: { type: String, required: true },
	customerPhone: { type: String, required: true },
	customerAddress: { type: String, required: true },
	additionalInfo: { type: String, required: false },
	items: [OrderItemSchema],
	subtotalPrice: { type: Number, required: true },
	vatAmount: { type: Number, required: false },
	discountAmount: { type: Number, required: false },
	shippingFee: { type: Number, required: false },
	totalPrice: { type: Number, required: true },
	status: { type: String, enum: ORDER_STATUS, default: 'pending' },
	paymentMethod: { type: String, enum: ORDER_PAYMENT_METHODS, required: true },
	type: { type: String, enum: ORDER_TYPES, default: 'normal' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

OrderSchema.index({ customerId: 1 });
OrderSchema.index({ customerId: 1, status: 1 });
OrderSchema.index({ items: 1, status: 1 });

export const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default OrderModel;
