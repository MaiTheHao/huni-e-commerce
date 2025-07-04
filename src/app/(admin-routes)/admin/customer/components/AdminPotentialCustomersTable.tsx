'use client';
import React from 'react';
import styles from '../../../Admin.module.scss';
import AdminItemsTable from '../../components/AdminItemsTable';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import { formatDateToVietnameseString } from '@/util/date';
import { IUser } from '@/interfaces';
import { toLocalePrice } from '@/util';
import { deleteUser } from '../apis';
import Swal from 'sweetalert2';

type AdminPotentialCustomersTableProps = {
	users: IUser[];
	emptyMessage?: string;
	onDeleted?: () => void;
	isLoading?: boolean;
};

function AdminPotentialCustomersTable({ users, emptyMessage = 'Không có khách hàng tiềm năng nào.', onDeleted, isLoading = false }: AdminPotentialCustomersTableProps) {
	const handleDeleteUser = async (user: IUser) => {
		const controller = new AbortController();
		const [err, result] = await deleteUser(user, controller.signal);

		if (result === 'canceled') {
			return;
		}

		if (err) {
			await Swal.fire({
				icon: 'error',
				title: 'Lỗi',
				text: err?.message || 'Xóa người dùng thất bại.',
				confirmButtonText: 'Đóng',
			});
		} else if (result === 'deleted') {
			if (onDeleted) {
				onDeleted();
			}
			await Swal.fire({
				icon: 'success',
				title: 'Thành công',
				text: 'Người dùng đã được xóa.',
				confirmButtonText: 'Đóng',
			});
		}
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
					href: `/admin/customer/${user._id}`,
					data: user,
				})) ?? []
			}
			emptyMessage={emptyMessage}
			onDelete={(row) => handleDeleteUser(row.data)}
			loading={isLoading}
		/>
	);
}

export default AdminPotentialCustomersTable;
