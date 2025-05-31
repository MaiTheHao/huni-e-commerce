'use client';
import React, { memo, useCallback, useState } from 'react';
import ModalSideBar from '../modal-sidebar/ModalSideBar';
import CheckBox from '../check-box/CheckBox';
import styles from './AppSortFilter.module.scss';
import { AppSortFilterProps, AppSortFilterSubmitProps } from './AppSortFilter';
import clsx from 'clsx';

type Props = {
	initialFilters: AppSortFilterProps['initialFilters'];
	isOpen: boolean;
	handleToggleModal: (value: boolean) => void;
	onSubmit?: (value: AppSortFilterSubmitProps['filter']) => void;
};

function AppSortFilterModal({ initialFilters, isOpen, handleToggleModal, onSubmit }: Props) {
	const [filters, setFilters] = useState<AppSortFilterSubmitProps['filter']>(
		initialFilters.reduce((acc, selectConfig) => ({ ...acc, [selectConfig.fieldId]: null }), {})
	);

	const handleFilterChange = useCallback(
		(fieldId: string, value: string) => {
			if (filters[fieldId] === value) {
				setFilters((prevFilters) => ({
					...prevFilters,
					[fieldId]: null,
				}));
				return;
			}
			setFilters((prevFilters) => ({
				...prevFilters,
				[fieldId]: value,
			}));
		},
		[filters]
	);

	const handleClearFilters = useCallback(() => {
		setFilters(initialFilters.reduce((acc, selectConfig) => ({ ...acc, [selectConfig.fieldId]: null }), {}));
	}, [initialFilters]);

	const handleSubmit = useCallback(() => {
		handleToggleModal(false);
		onSubmit?.(filters);
	}, [filters, onSubmit]);

	return (
		<ModalSideBar title='Lọc sản phẩm' isOpen={isOpen} setOpen={handleToggleModal}>
			<section className={styles.modal}>
				<ul className={styles.modalList}>
					{initialFilters?.map((filter) => (
						<li key={`App sort filter modal--id ${filter.fieldId}`} className={styles.modalItem}>
							<h4>{filter.placeholder}</h4>
							<ul className={styles.checkboxList}>
								{filter.options?.map((option) => (
									<li key={`App sort filter modal--value ${option.value}`}>
										<CheckBox
											label={option.label}
											value={option.value}
											checked={filters[filter.fieldId] === option.value}
											customClasses={{
												label: styles.checkboxLabel,
											}}
											onChange={(value, checked) => handleFilterChange(filter.fieldId, value)}
										/>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
				<div className={styles.modalActions}>
					<button className={clsx(styles.modalButton, 'cta-button')} onClick={handleSubmit}>
						Xem kết quả
					</button>
					<button className={clsx(styles.modalButton, 'cta-button--outlined')} onClick={handleClearFilters}>
						Xoá bộ lọc
					</button>
				</div>
			</section>
		</ModalSideBar>
	);
}

export default memo(AppSortFilterModal);
