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
import { deleteOrder } from '../apis';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

type AdminOrdersTableProps = {
	orders: IOrder[];
	emptyMessage?: string;
	isLoading?: boolean;
	onDeleted?: () => void;
};

function AdminOrdersTable({ orders, emptyMessage = 'Không có đơn hàng nào.', isLoading = false, onDeleted }: AdminOrdersTableProps) {
	const router = useRouter();

	const handleDeleteOrder = async (order: IOrder) => {
		const controller = new AbortController();
		const [err, result] = await deleteOrder(order, controller.signal);

		if (result === 'canceled') {
			return;
		}

		if (err) {
			await Swal.fire({
				icon: 'error',
				title: 'Lỗi',
				text: err?.message || 'Xóa đơn hàng thất bại.',
				confirmButtonText: 'Đóng',
			});
		} else if (result === 'deleted') {
			if (onDeleted) {
				onDeleted();
			}
			await Swal.fire({
				icon: 'success',
				title: 'Thành công',
				text: 'Đơn hàng đã được xóa.',
				confirmButtonText: 'Đóng',
			});
		}
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
					href: `/admin/order/${order._id}`,
					data: order,
				})) ?? []
			}
			emptyMessage={emptyMessage}
			onDelete={(row) => handleDeleteOrder(row.data)}
			loading={isLoading}
		/>
	);
}

export default AdminOrdersTable;
