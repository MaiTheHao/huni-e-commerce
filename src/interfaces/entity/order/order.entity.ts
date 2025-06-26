import mongoose from 'mongoose';

export interface IOrderItem {
	productId: string;
	productName: string;
	productImage: string;
	quantity: number;
	unitPrice: number; // Giá đơn vị sau khi áp dụng giảm giá
	subtotalPrice: number; // Tổng giá cho mặt hàng này (quantity * unitPrice)
	discountAmount?: number; // Số tiền giảm giá cho mặt hàng này
}

export const ORDER_TYPES = ['normal', 'anonymous'] as const;
export type TOrderType = (typeof ORDER_TYPES)[number];

/**
 * Danh sách các trạng thái đơn hàng:
 * - 'pending': Đơn hàng vừa được tạo, đang chờ xác nhận.
 * - 'confirmed': Đơn hàng đã được xác nhận bởi hệ thống hoặc người bán.
 * - 'shipped': Đơn hàng đã được gửi đi cho đơn vị vận chuyển.
 * - 'delivered': Đơn hàng đã được giao thành công tới khách hàng.
 * - 'cancelled': Đơn hàng đã bị hủy bởi khách hàng hoặc người bán.
 */
export const ORDER_STATUS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type TOrderStatus = (typeof ORDER_STATUS)[number];

export interface IOrderBase {
	customerId: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	customerAddress: string;
	additionalInfo?: string;
	items: IOrderItem[];
	subtotalPrice: number; // Tổng giá trước thuế và giảm giá
	vatAmount?: number; // Số tiền thuế (nếu có)
	discountAmount?: number; // Tổng số tiền giảm giá (nếu có)
	shippingFee?: number; // Thêm phí vận chuyển nếu cần
	totalPrice: number; // Tổng giá cuối cùng đã bao gồm thuế, giảm giá, phí ship
	status: TOrderStatus;
	type: TOrderType;
	createdAt: Date;
	updatedAt: Date;
}

export interface IOrder extends IOrderBase {
	_id: string;
}

export interface IOrderDocument extends IOrderBase, mongoose.Document<mongoose.Types.ObjectId> {}

export interface ICreateOrderData {
	customerId?: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	customerAddress: string;
	additionalInfo?: string;
	items: IOrderItem[];
	subtotalPrice: number;
	vatAmount?: number;
	discountAmount?: number;
	shippingFee?: number;
	totalPrice: number;
}
