import React, { memo } from 'react';
import styles from './AppSortFilter.module.scss';
import { AppSortFilterProps, AppSortFilterSubmitProps } from './AppSortFilter';
import Select from '../select/Select';

type Props = {
	initialFilters: AppSortFilterProps['initialFilters'];
	currentFilters?: AppSortFilterSubmitProps['filter'];
	handleFilterChange: (fieldId: string, value: string) => void;
};

function AppSortFilterQuick({ initialFilters, currentFilters, handleFilterChange }: Props) {
	return (
		<ul className={styles.quickFilter}>
			{initialFilters?.slice(0, 5).map((filter, index) => (
				<li key={`App sort filter ${filter.fieldId}`} className={styles.quickFilterItem}>
					<Select
						options={filter.options}
						placeholder={filter.placeholder}
						selectedValue={currentFilters?.[filter.fieldId] || ''}
						searchable
						onSelect={(value) => handleFilterChange(filter.fieldId, value)}
					/>
				</li>
			))}
		</ul>
	);
}

export default memo(AppSortFilterQuick);
