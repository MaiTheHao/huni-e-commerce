'use client';
import React, { useMemo } from 'react';
import { IOrder, IPagination, ISearchFilterOrderRequest, TOrderSortCriteria } from '@/interfaces';
import styles from '../../Admin.module.scss';
import AdminOrdersTable from './components/AdminOrdersTable';
import PaginationBar from '@/components/navigation/pagination-bar/PaginationBar';
import Select from '@/components/ui/select/Select';
import { ORDER_STATUS, ORDER_PAYMENT_METHODS, ORDER_TYPES } from '@/interfaces';
import { ORDER_STATUS_TEXT_MAP, ORDER_TYPE_TEXT_MAP, PAYMENT_METHOD_TEXT_MAP } from '@/consts/map-value';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface AdminOrderUIWrapperProps {
	orders: IOrder[];
	pagination: IPagination;
	isLoading: boolean;
	filterCriteria: ISearchFilterOrderRequest['criteria'];
	sortCriteria: TOrderSortCriteria;
	searchKeyword: string;
	onRefetch?: () => void;
	onStatusChange: (value: string | null) => void;
	onPaymentMethodChange: (value: string | null) => void;
	onOrderTypeChange: (value: string | null) => void;
	onSortFieldChange: (value: string | null) => void;
	onSearchChange: (keyword: string) => void;
	onResetFilters?: () => void;
	onPageChange: (page: number) => void;
}

function AdminOrderUIWrapperComponent({
	orders,
	pagination,
	isLoading,
	filterCriteria,
	sortCriteria,
	searchKeyword,
	onRefetch,
	onStatusChange,
	onPaymentMethodChange,
	onOrderTypeChange,
	onSortFieldChange,
	onSearchChange,
	onResetFilters,
	onPageChange,
}: AdminOrderUIWrapperProps) {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const keyword = e.target.value;
		onSearchChange(keyword);
	};

	const statusOptions = useMemo(
		() =>
			ORDER_STATUS.map((status) => ({
				value: status,
				label: ORDER_STATUS_TEXT_MAP[status],
			})),
		[]
	);

	const paymentMethodOptions = useMemo(
		() =>
			ORDER_PAYMENT_METHODS.map((method) => ({
				value: method,
				label: PAYMENT_METHOD_TEXT_MAP[method],
			})),
		[]
	);

	const orderTypeOptions = useMemo(
		() =>
			ORDER_TYPES.map((type) => ({
				value: type,
				label: ORDER_TYPE_TEXT_MAP[type],
			})),
		[]
	);

	const sortOptions = useMemo(
		() => [
			{ value: 'createdAt--desc', label: 'Mới nhất' },
			{ value: 'createdAt--asc', label: 'Cũ nhất' },
			{ value: 'totalPrice--desc', label: 'Tổng tiền giảm' },
			{ value: 'totalPrice--asc', label: 'Tổng tiền tăng' },
		],
		[]
	);

	return (
		<>
			<div className={styles['admin-toolbar']}>
				<div className={styles['admin-toolbar__filters']}>
					<Select options={statusOptions} placeholder='Trạng thái' onSelect={onStatusChange} />
					<Select options={paymentMethodOptions} placeholder='Phương thức thanh toán' onSelect={onPaymentMethodChange} />
					<Select options={orderTypeOptions} placeholder='Loại đơn hàng' onSelect={onOrderTypeChange} />
					<Select options={sortOptions} placeholder='Sắp xếp theo' onSelect={onSortFieldChange} />
				</div>
				<div className={styles['admin-toolbar__search']}>
					<input
						type='text'
						placeholder='Tìm kiếm theo mã đơn, thông tin khách hàng...'
						className={styles['admin-toolbar__search-input']}
						value={searchKeyword}
						onChange={handleSearchChange}
					/>
					<FontAwesomeIcon icon={faSearch} className={styles['admin-toolbar__search-icon']} />
				</div>
			</div>
			<span className='note'>Các đơn bị xóa sẽ không được hiển thị.</span>
			<AdminOrdersTable orders={orders} emptyMessage='Không có đơn hàng nào.' isLoading={isLoading} onDeleted={onRefetch} />
			<PaginationBar
				page={pagination.page}
				limit={pagination.limit}
				total={pagination.total}
				totalPages={pagination.totalPages}
				onPageChange={onPageChange}
				itemType='đơn hàng'
				ariaLabel='Phân trang đơn hàng'
				className={styles['admin-pagination-bar']}
			/>
		</>
	);
}

function withMemo<T>(Component: React.ComponentType<T>) {
	return React.memo(Component);
}

const AdminOrderUIWrapper = withMemo(AdminOrderUIWrapperComponent);

export default AdminOrderUIWrapper;
