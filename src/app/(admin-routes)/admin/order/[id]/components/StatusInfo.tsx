import React from 'react';
import { IOrder, TOrderStatus, ORDER_STATUS } from '@/interfaces/entity/order/order.entity';
import { ORDER_TYPE_TEXT_MAP, PAYMENT_METHOD_TEXT_MAP, ORDER_STATUS_TEXT_MAP } from '@/consts/map-value';
import OrderStatus from '@/components/ui/order-status/OrderStatus';
import styles from '../OrderDetail.module.scss';
import Select from '@/components/ui/select/Select';

interface StatusInfoProps {
	order: IOrder;
	editMode?: boolean;
	editForm?: {
		customerName: string;
		customerEmail: string;
		customerPhone: string;
		customerAddress: string;
		additionalInfo: string;
		status: TOrderStatus;
	};
	setEditForm?: React.Dispatch<
		React.SetStateAction<{
			customerName: string;
			customerEmail: string;
			customerPhone: string;
			customerAddress: string;
			additionalInfo: string;
			status: TOrderStatus;
		}>
	>;
}

const StatusInfo: React.FC<StatusInfoProps> = ({ order, editMode = false, editForm, setEditForm }) => {
	const handleStatusChange = (status: TOrderStatus) => {
		if (setEditForm) {
			setEditForm((prev) => ({ ...prev, status }));
		}
	};

	return (
		<div className={styles.section}>
			<h2 className={styles.section__title}>Trạng thái & Thanh toán</h2>
			<div className={styles.status__grid}>
				<div className={styles.status__item}>
					<span className={styles.status__label}>Trạng thái đơn hàng</span>
					{editMode && editForm ? (
						<Select
							options={ORDER_STATUS.map((status) => ({
								value: status,
								label: ORDER_STATUS_TEXT_MAP[status] || status,
							}))}
							defaultValue={editForm.status}
							defaultLabel={ORDER_STATUS_TEXT_MAP[editForm.status] || editForm.status}
							selectedValue={editForm.status}
							onSelect={(value) => handleStatusChange(value as TOrderStatus)}
						/>
					) : (
						<OrderStatus status={order.status} />
					)}
				</div>
				<div className={styles.status__item}>
					<span className={styles.status__label}>Phương thức thanh toán</span>
					<span className={styles.status__value}>{PAYMENT_METHOD_TEXT_MAP[order.paymentMethod] || order.paymentMethod}</span>
				</div>
				<div className={styles.status__item}>
					<span className={styles.status__label}>Loại đơn hàng</span>
					<span className={styles.status__value}>{ORDER_TYPE_TEXT_MAP[order.type] || order.type}</span>
				</div>
				<div className={styles.status__item}>
					<span className={styles.status__label}>Ngày tạo</span>
					<span className={`${styles.status__value} ${styles.status__date}`}>{new Date(order.createdAt).toLocaleString()}</span>
				</div>
				<div className={styles.status__item}>
					<span className={styles.status__label}>Cập nhật cuối</span>
					<span className={`${styles.status__value} ${styles.status__date}`}>{new Date(order.updatedAt).toLocaleString()}</span>
				</div>
			</div>
		</div>
	);
};

export default StatusInfo;
