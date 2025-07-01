'use client';
import React from 'react';
import styles from '../../../Admin.module.scss';
import AdminItemsTable from '../../components/AdminItemsTable';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import { formatDateToVietnameseString } from '@/util/date';
import { IUser } from '@/interfaces';
import { toLocalePrice } from '@/util';

type AdminPotentialCustomersTableProps = {
	users: IUser[];
	emptyMessage?: string;
	isLoading?: boolean;
};

function AdminPotentialCustomersTable({ users, emptyMessage = 'Không có khách hàng tiềm năng nào.', isLoading = false }: AdminPotentialCustomersTableProps) {
	const handleDetailUser = (user: IUser) => {
		alert(`View user details: ${JSON.stringify(user, null, 2)}`);
	};

	const handleDeleteUser = (user: IUser) => {
		alert(`Delete user: ${JSON.stringify(user, null, 2)}`);
	};

	return (
		<AdminItemsTable
			columns={[
				{ header: 'ID', className: styles['table-col--id'] },
				{ header: 'Tên', className: styles['potential-customers-table-col--name'] },
				{ header: 'Tổng đơn', className: styles['potential-customers-table-col--orders'] },
				{ header: 'Tổng chi tiêu', className: styles['potential-customers-table-col--spent'] },
				{ header: 'Đơn gần nhất', className: styles['potential-customers-table-col--date'] },
			]}
			rows={
				users?.map((user) => ({
					key: user._id,
					cells: [
						<div className={styles['table-col--id__wrapper']} key='id'>
							<p className={styles['table-col--id__value']}>#{user._id}</p>
							<CopyButton value={user._id} />
						</div>,
						user.name,
						user.metrics?.totalOrders,
						<span className='price' key='total'>
							{toLocalePrice(user?.metrics?.totalAmountSpent || 0)}
						</span>,
						user.metrics?.lastOrderDate ? formatDateToVietnameseString(user.metrics.lastOrderDate) : '',
					],
					data: user,
				})) ?? []
			}
			emptyMessage={emptyMessage}
			onDetail={(row) => handleDetailUser(row.data)}
			onDelete={(row) => handleDeleteUser(row.data)}
			loading={isLoading}
		/>
	);
}

export default AdminPotentialCustomersTable;
