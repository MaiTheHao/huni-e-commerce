'use client';
import React, { useMemo } from 'react';
import { IKeyboard, IPagination, ISearchFilterKeyboardRequest, TKeyboardSortCriteria, KEYBOARD_LAYOUTS, KEYBOARD_CONNECTIVITIES } from '@/interfaces';
import styles from '../../../Admin.module.scss';
import AdminKeyboardsTable from './components/AdminKeyboardsTable';
import PaginationBar from '@/components/navigation/pagination-bar/PaginationBar';
import Select from '@/components/ui/select/Select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface AdminKeyboardUIWrapperProps {
	keyboards: IKeyboard[];
	pagination: IPagination;
	isLoading: boolean;
	filterCriteria: ISearchFilterKeyboardRequest['criteria'];
	sortCriteria: TKeyboardSortCriteria;
	searchKeyword: string;
	onLayoutChange: (value: string | null) => void;
	onStatusChange: (value: string | null) => void;
	onSortFieldChange: (value: string | null) => void;
	onSearchChange: (keyword: string) => void;
	onResetFilters?: () => void;
	onPageChange: (page: number) => void;
}

function AdminKeyboardUIWrapperComponent({
	keyboards,
	pagination,
	isLoading,
	filterCriteria,
	sortCriteria,
	searchKeyword,
	onLayoutChange,
	onStatusChange,
	onSortFieldChange,
	onSearchChange,
	onResetFilters,
	onPageChange,
}: AdminKeyboardUIWrapperProps) {
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const keyword = e.target.value;
		onSearchChange(keyword);
	};

	const layoutOptions = useMemo(
		() =>
			KEYBOARD_LAYOUTS.map((layout) => ({
				value: layout,
				label: layout,
			})),
		[]
	);

	const statusOptions = useMemo(
		() => [
			{ value: 'true', label: 'Hoạt động' },
			{ value: 'false', label: 'Không hoạt động' },
		],
		[]
	);

	const sortOptions = useMemo(
		() => [
			{ value: 'createdAt--desc', label: 'Mới nhất' },
			{ value: 'createdAt--asc', label: 'Cũ nhất' },
			{ value: 'name--asc', label: 'Tên A-Z' },
			{ value: 'name--desc', label: 'Tên Z-A' },
			{ value: 'price--desc', label: 'Giá giảm' },
			{ value: 'price--asc', label: 'Giá tăng' },
			{ value: 'stock--desc', label: 'Tồn kho giảm' },
			{ value: 'stock--asc', label: 'Tồn kho tăng' },
			{ value: 'layout--asc', label: 'Layout A-Z' },
			{ value: 'layout--desc', label: 'Layout Z-A' },
		],
		[]
	);

	return (
		<>
			<div className={styles['admin-toolbar']}>
				<div className={styles['admin-toolbar__filters']}>
					<Select options={layoutOptions} placeholder='Layout' onSelect={onLayoutChange} />
					<Select options={statusOptions} placeholder='Trạng thái' onSelect={onStatusChange} />
					<Select options={sortOptions} placeholder='Sắp xếp theo' onSelect={onSortFieldChange} />
				</div>
				<div className={styles['admin-toolbar__search']}>
					<input type='text' placeholder='Tìm kiếm theo ID, tên, model, series, ...' className={styles['admin-toolbar__search-input']} value={searchKeyword} onChange={handleSearchChange} />
					<FontAwesomeIcon icon={faSearch} className={styles['admin-toolbar__search-icon']} />
				</div>
			</div>
			<AdminKeyboardsTable keyboards={keyboards} emptyMessage='Không có bàn phím nào.' isLoading={isLoading} />
			<PaginationBar
				page={pagination.page}
				limit={pagination.limit}
				total={pagination.total}
				totalPages={pagination.totalPages}
				onPageChange={onPageChange}
				itemType='bàn phím'
				ariaLabel='Phân trang bàn phím'
				className={styles['admin-pagination-bar']}
			/>
		</>
	);
}

function withMemo<T>(Component: React.ComponentType<T>) {
	return React.memo(Component);
}

const AdminKeyboardUIWrapper = withMemo(AdminKeyboardUIWrapperComponent);

export default AdminKeyboardUIWrapper;
