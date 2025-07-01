'use client';
import React from 'react';
import styles from '../../../Admin.module.scss';
import AdminItemsTable from '../../components/AdminItemsTable';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import { formatDateToVietnameseString } from '@/util/date';
import { IUser } from '@/interfaces';
import { toLocalePrice } from '@/util';

type AdminCustomersTableProps = {
	users: IUser[];
	emptyMessage?: string;
	isLoading?: boolean;
};

function AdminCustomersTable({ users, emptyMessage = 'Không có người dùng nào.', isLoading = false }: AdminCustomersTableProps) {
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
				{ header: 'Tên', className: styles['customers-table-col--name'] },
				{ header: 'Email', className: styles['customers-table-col--email'] },
				{ header: 'Số điện thoại', className: styles['customers-table-col--phone'] },
				{ header: 'Vai trò', className: styles['customers-table-col--role'] },
				{ header: 'Tổng đơn hàng', className: styles['customers-table-col--orders'] },
				{ header: 'Tổng tiền đã chi', className: styles['customers-table-col--spent'] },
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
						user.email,
						user.phone,
						user?.roles?.join(', ') || 'Chưa xác định',
						user.metrics?.totalOrders ?? 0,
						<span className='price' key='total'>
							{toLocalePrice(user?.metrics?.totalAmountSpent || 0)}
						</span>,
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

export default AdminCustomersTable;
