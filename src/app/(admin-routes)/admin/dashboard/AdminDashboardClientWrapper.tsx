'use client';
import React, { useEffect } from 'react';
import styles from '../../Admin.module.scss';
import { ICustomerStats, IOrderStats, IProductStats } from './AdminDashboardServerWrapper';
import AdminDashboardCards from './components/AdminDashboardCards';
import AdminOrdersTable from '../order/components/AdminOrdersTable';
import AdminPotentialCustomersTable from '../customer/components/AdminPotentialCustomersTable';

type Props = {
	orderStats: IOrderStats;
	customerStats: ICustomerStats;
	productStats: IProductStats;
};

function AdminDashboardClientWrapper({ orderStats, customerStats, productStats }: Props) {
	return (
		<>
			<div className={styles['dashboard-header']}>
				<AdminDashboardCards orderStats={orderStats} customerStats={customerStats} productStats={productStats} />
			</div>

			<div className={styles.section}>
				<h2 className={styles['section-title']}>Đơn hàng gần đây</h2>
				<AdminOrdersTable orders={orderStats.orders ?? []} emptyMessage='Không có đơn hàng nào gần đây.' />
			</div>

			<div className={styles.section}>
				<h2 className={styles['section-title']}>Khách hàng tiềm năng</h2>
				<span className='note'>Lưu ý: Số đơn hàng và tổng chi tiêu chỉ bao gồm các đơn hàng đã giao thành công.</span>
				<AdminPotentialCustomersTable users={customerStats.potential ?? []} emptyMessage='Không có khách hàng tiềm năng nào.' />
			</div>
		</>
	);
}

export default AdminDashboardClientWrapper;
