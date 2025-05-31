import React, { memo } from 'react';
import { AppSortFilterProps, AppSortFilterSubmitProps } from './AppSortFilter';
import styles from './AppSortFilter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from '../select/Select';
import { faArrowUpShortWide, faSliders } from '@fortawesome/free-solid-svg-icons';

type Props = {
	initialSort?: AppSortFilterProps['initialSort'];
	currentSort?: AppSortFilterSubmitProps['sort'];
	handleSortChange: (value: string) => void;
	handleToggleModal: (value: boolean) => void;
};

function AppSortFilterActions({ initialSort, currentSort, handleSortChange, handleToggleModal }: Props) {
	return (
		<ul className={styles.sortFilterActions}>
			<li className={styles.sortFilterAction} onClick={(e) => handleToggleModal(true)}>
				<FontAwesomeIcon icon={faSliders} />
				<button>Lọc</button>
			</li>
			<li>
				<Select
					options={initialSort || []}
					placeholder='Sắp xếp'
					searchable
					selectedValue={currentSort}
					customFaIcon={<FontAwesomeIcon icon={faArrowUpShortWide} />}
					customClassName={{
						trigger: styles.sortTrigger,
					}}
					onSelect={handleSortChange}
				/>
			</li>
		</ul>
	);
}

export default memo(AppSortFilterActions);
