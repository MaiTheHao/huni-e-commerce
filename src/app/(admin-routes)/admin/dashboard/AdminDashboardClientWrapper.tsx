'use client';
import React from 'react';
import styles from './Dashboard.module.scss';
import { toLocalePrice } from '@/util';
import { formatDateToVietnameseString } from '@/util/date';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import OrderStatus from '@/components/ui/order-status/OrderStatus';
import { ICustomerStats, IOrderStats, IProductStats } from './AdminDashboardServerWrapper';
import AdminDashboardCards from './components/AdminDashboardCards';
import AdminDashboardTable from './components/AdminDashboardTable';

type Props = {
	orderStats: IOrderStats;
	customerStats: ICustomerStats;
	productStats: IProductStats;
};

function AdminDashboardClientWrapper({ orderStats, customerStats, productStats }: Props) {
	return (
		<>
			<div className={styles.header}>
				<AdminDashboardCards orderStats={orderStats} customerStats={customerStats} productStats={productStats} />
			</div>

			<div className={styles.part}>
				<h2 className={styles['part-title']}>Đơn hàng gần đây</h2>
				<AdminDashboardTable
					columns={[
						{ header: 'Mã đơn hàng', className: styles['orders-table__body__id'] },
						{ header: 'Khách hàng', className: styles['orders-table__body__customer'] },
						{ header: 'Ngày đặt', className: styles['orders-table__body__date'] },
						{ header: 'Thành tiền', className: styles['orders-table__body__total'] },
						{ header: 'Trạng thái', className: styles['orders-table__body__status'] },
					]}
					rows={
						orderStats.orders?.map((order) => ({
							key: order._id,
							cells: [
								<div className={styles['orders-table__body__id__wrapper']}>
									<p className={styles['orders-table__body__id__value']}>#{order._id}</p>
									<CopyButton value={order._id} />
								</div>,
								order.customerName,
								formatDateToVietnameseString(order.createdAt),
								<span className='price'>{toLocalePrice(order.totalPrice)}</span>,
								<OrderStatus status={order.status} />,
							],
						})) ?? []
					}
					tableClassName={styles['orders-table']}
					headClassName={styles['orders-table__head']}
					bodyClassName={styles['orders-table__body']}
					emptyMessage='Không có đơn hàng nào gần đây.'
					colSpan={5}
				/>
			</div>

			<div className={styles.part}>
				<h2 className={styles['part-title']}>Khách hàng tiềm năng</h2>
				<AdminDashboardTable
					columns={[
						{ header: 'Email', className: styles['customers-table__body__email'] },
						{ header: 'Tên khách hàng', className: styles['customers-table__body__name'] },
						{ header: 'Số đơn đã nhận', className: styles['customers-table__body__orders'] },
						{ header: 'Tổng chi tiêu', className: styles['customers-table__body__spent'] },
						{ header: 'Đơn gần nhất', className: styles['customers-table__body__lastorder'] },
					]}
					rows={
						customerStats.potential?.map((customer) => ({
							key: customer._id,
							cells: [
								<div className={styles['customers-table__body__email__wrapper']}>
									<p className={styles['customers-table__body__email__value']}>{customer.email}</p>
									<CopyButton value={customer.email} />
								</div>,
								customer.name,
								customer.metrics?.totalOrders ?? 0,
								<span className='price'>{toLocalePrice(customer.metrics?.totalAmountSpent ?? 0)}</span>,
								customer.metrics?.lastOrderDate ? formatDateToVietnameseString(customer.metrics.lastOrderDate) : '',
							],
						})) ?? []
					}
					tableClassName={styles['customers-table']}
					headClassName={styles['customers-table__head']}
					bodyClassName={styles['customers-table__body']}
					emptyMessage='Không có khách hàng tiềm năng nào.'
					colSpan={5}
				/>
			</div>
		</>
	);
}

export default AdminDashboardClientWrapper;
