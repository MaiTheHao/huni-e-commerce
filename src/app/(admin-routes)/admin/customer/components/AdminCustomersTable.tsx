'use client';
import React from 'react';
import styles from '../../../Admin.module.scss';
import AdminItemsTable from '../../components/AdminItemsTable';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import { IUser } from '@/interfaces';
import { toLocalePrice } from '@/util';
import { deleteUser } from '../apis';
import Swal from 'sweetalert2';

type AdminCustomersTableProps = {
	users: IUser[];
	emptyMessage?: string;
	onDeleted?: () => void;
	isLoading?: boolean;
};

function AdminCustomersTable({ users, emptyMessage = 'Không có người dùng nào.', onDeleted, isLoading = false }: AdminCustomersTableProps) {
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
						<span>
							{user.email}
							{!user?.isEmailVerified && (
								<span title='Email chưa xác thực' style={{ color: 'red', marginLeft: '1ch' }}>
									(chưa xác thực)
								</span>
							)}
						</span>,
						user.phone,
						user?.roles?.join(', ') || 'Chưa xác định',
						user.metrics?.totalOrders ?? 0,
						<span className='price' key='total'>
							{toLocalePrice(user?.metrics?.totalAmountSpent || 0)}
						</span>,
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

export default AdminCustomersTable;
