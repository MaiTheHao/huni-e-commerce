'use client';
import React, { memo, useCallback, useEffect, useState } from 'react';
import styles from './AppSortFilter.module.scss';
import { SelectProps } from '@/components/select/Select';
import AppSortFilterModal from './AppSortFilterModal';
import AppSortFilterQuick from './AppSortFilterQuick';
import AppSortFilterActions from './AppSortFilterActions';

const DEFAULT_SORT_OPTIONS = [
	{
		value: 'default',
		label: 'Mặc định',
	},
	{
		value: 'price-asc',
		label: 'Giá tăng dần',
	},
	{
		value: 'price-desc',
		label: 'Giá giảm dần',
	},
	{
		value: 'name-asc',
		label: 'Tên A-Z',
	},
	{
		value: 'name-desc',
		label: 'Tên Z-A',
	},
];

export type AppSortFilterSubmitProps = { filter: Record<string, string | null>; sort: string };
export type AppSortFilterProps = {
	initialFilters: (SelectProps & {
		fieldId: string;
	})[];
	initialSort?: {
		value: string;
		label: string;
	}[];
	onSubmit?: (value: AppSortFilterSubmitProps) => void;
};

function AppSortFilter({ initialFilters, initialSort = DEFAULT_SORT_OPTIONS, onSubmit }: AppSortFilterProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [criteria, setCriteria] = useState<AppSortFilterSubmitProps>({
		filter: initialFilters.reduce((acc, selectConfig) => ({ ...acc, [selectConfig.fieldId]: null }), {}),
		sort: initialSort[0].value,
	});

	const handleSubmit = useCallback(
		(value?: AppSortFilterSubmitProps) => {
			onSubmit?.(value || criteria);
		},
		[criteria, onSubmit]
	);

	const handleModalSubmit = useCallback(
		(value: AppSortFilterSubmitProps['filter']) => {
			const newCriteria = {
				...criteria,
				filter: value,
			};
			setCriteria(newCriteria);
			handleSubmit(newCriteria);
		},
		[handleSubmit]
	);

	const handleToggleModal = useCallback((value: boolean) => {
		setIsOpen(value);
	}, []);

	const handleFilterChange = useCallback(
		(fieldId: string, value: string) => {
			const newCriteria = {
				...criteria,
				filter: {
					...criteria.filter,
					[fieldId]: value,
				},
			};

			setCriteria(newCriteria);
			onSubmit?.(newCriteria);
		},
		[criteria]
	);

	const handleSortChange = useCallback(
		(value: string) => {
			const newCriteria = { ...criteria, sort: value };
			setCriteria(newCriteria);
			onSubmit?.(newCriteria);
		},
		[criteria]
	);

	return (
		<>
			<section className={styles.sortFilter}>
				<AppSortFilterActions
					initialSort={initialSort}
					currentSort={criteria.sort}
					handleSortChange={handleSortChange}
					handleToggleModal={handleToggleModal}
				/>
				<AppSortFilterQuick
					initialFilters={initialFilters}
					currentFilters={criteria.filter}
					handleFilterChange={handleFilterChange}
				/>
			</section>

			<AppSortFilterModal
				initialFilters={initialFilters}
				isOpen={isOpen}
				handleToggleModal={handleToggleModal}
				onSubmit={handleModalSubmit}
			/>
		</>
	);
}

export default memo(AppSortFilter);
