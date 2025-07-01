'use client';
import React from 'react';
import styles from '../../../Admin.module.scss';
import { toLocalePrice } from '@/util';
import { formatDateToVietnameseString } from '@/util/date';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import OrderStatus from '@/components/ui/order-status/OrderStatus';
import AdminItemsTable from '../../components/AdminItemsTable';
import { IOrder } from '@/interfaces';
import { PAYMENT_METHOD_TEXT_MAP } from '@/consts/map-value';

type AdminOrdersTableProps = {
	orders: IOrder[];
	emptyMessage?: string;
	isLoading?: boolean;
};

function AdminOrdersTable({ orders, emptyMessage = 'Không có đơn hàng nào.', isLoading = false }: AdminOrdersTableProps) {
	const handleDetailUser = (order: IOrder) => {
		alert(`View order details: ${JSON.stringify(order, null, 2)}`);
	};

	const handleDeleteOrder = (order: IOrder) => {
		console.log('Delete order:', order);
	};

	return (
		<AdminItemsTable
			columns={[
				{ header: 'Mã đơn hàng', className: styles['table-col--id'] },
				{ header: 'Khách hàng', className: styles['orders-table-col--customer'] },
				{ header: 'Ngày đặt', className: styles['orders-table-col--date'] },
				{ header: 'Phương thức', className: styles['orders-table-col--payment'] },
				{ header: 'Thành tiền', className: styles['orders-table-col--total'] },
				{ header: 'Trạng thái', className: styles['orders-table-col--status'] },
			]}
			rows={
				orders?.map((order) => ({
					key: order._id,
					cells: [
						<div className={styles['table-col--id__wrapper']} key='id'>
							<p className={styles['table-col--id__value']}>#{order._id}</p>
							<CopyButton value={order._id} />
						</div>,
						order.customerName,
						formatDateToVietnameseString(order.createdAt),
						PAYMENT_METHOD_TEXT_MAP[order.paymentMethod] || 'Không xác định',
						<span className='price' key='total'>
							{toLocalePrice(order.totalPrice)}
						</span>,
						<OrderStatus status={order.status} key='status' />,
					],
					data: order,
				})) ?? []
			}
			emptyMessage={emptyMessage}
			onDetail={(row) => handleDetailUser(row.data)}
			onDelete={(row) => handleDeleteOrder(row.data)}
			loading={isLoading}
		/>
	);
}

export default AdminOrdersTable;
