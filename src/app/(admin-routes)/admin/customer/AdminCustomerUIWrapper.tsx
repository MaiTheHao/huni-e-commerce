'use client';
import React, { useMemo } from 'react';
import { IUser, IPagination, ISearchFilterUserRequest, TUserSortCriteria, USER_ROLES } from '@/interfaces';
import styles from '../../Admin.module.scss';
import AdminCustomersTable from './components/AdminCustomersTable';
import PaginationBar from '@/components/navigation/pagination-bar/PaginationBar';
import Select from '@/components/ui/select/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface AdminCustomerUIWrapperProps {
	users: IUser[];
	pagination: IPagination;
	isLoading: boolean;
	filterCriteria: ISearchFilterUserRequest['criteria'];
	sortCriteria: TUserSortCriteria;
	searchKeyword: string;
	onRoleChange: (value: string | null) => void;
	onSortFieldChange: (value: string | null) => void;
	onSearchChange: (keyword: string) => void;
	onResetFilters?: () => void;
	onPageChange: (page: number) => void;
}

function AdminCustomerUIWrapperComponent({
	users,
	pagination,
	isLoading,
	filterCriteria,
	sortCriteria,
	searchKeyword,
	onRoleChange,
	onSortFieldChange,
	onSearchChange,
	onResetFilters,
	onPageChange,
}: AdminCustomerUIWrapperProps) {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const keyword = e.target.value;
		onSearchChange(keyword);
	};

	const roleOptions = useMemo(
		() =>
			USER_ROLES.map((role) => ({
				value: role,
				label: role,
			})),
		[]
	);

	const sortOptions = useMemo(
		() => [
			{ value: 'createdAt--desc', label: 'Mới nhất' },
			{ value: 'createdAt--asc', label: 'Cũ nhất' },
			{ value: 'name--asc', label: 'Tên A-Z' },
			{ value: 'name--desc', label: 'Tên Z-A' },
			{ value: 'email--asc', label: 'Email A-Z' },
			{ value: 'email--desc', label: 'Email Z-A' },
		],
		[]
	);

	return (
		<>
			<div className={styles['admin-toolbar']}>
				<div className={styles['admin-toolbar__filters']}>
					{/* Nếu có status filter thì thêm vào đây */}
					{/* <Select options={statusOptions} placeholder='Trạng thái' onSelect={onStatusChange} /> */}
					<Select options={roleOptions} placeholder='Vai trò' onSelect={onRoleChange} />
					<Select options={sortOptions} placeholder='Sắp xếp theo' onSelect={onSortFieldChange} />
				</div>
				<div className={styles['admin-toolbar__search']}>
					<input type='text' placeholder='Tìm kiếm theo tên, email, số điện thoại...' className={styles['admin-toolbar__search-input']} value={searchKeyword} onChange={handleSearchChange} />
					<FontAwesomeIcon icon={faSearch} className={styles['admin-toolbar__search-icon']} />
				</div>
			</div>
			<AdminCustomersTable users={users} emptyMessage='Không có người dùng nào.' isLoading={isLoading} />
			<PaginationBar
				page={pagination.page}
				limit={pagination.limit}
				total={pagination.total}
				totalPages={pagination.totalPages}
				onPageChange={onPageChange}
				itemType='khách hàng'
				ariaLabel='Phân trang khách hàng'
				className={styles['admin-pagination-bar']}
			/>
		</>
	);
}

function withMemo<T>(Component: React.ComponentType<T>) {
	return React.memo(Component);
}

const AdminCustomerUIWrapper = withMemo(AdminCustomerUIWrapperComponent);

export default AdminCustomerUIWrapper;
