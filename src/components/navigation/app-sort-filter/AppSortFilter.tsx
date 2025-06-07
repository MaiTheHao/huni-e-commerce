'use client';
import React, { useCallback, useState } from 'react';
import FilterSelect from './filter-select/FilterSelect';
import styles from './AppSortFilter.module.scss';
import clsx from 'clsx';
import useSearchFilterCriteriaContext from '@/contexts/SearchFilterCriteriaContext/useSearchFilterCriteriaContext';
import { TFilterCriteria } from '@/interfaces/filter-sort-criteria.interface';
import { toArray, toNumber } from '@/util/cast-type.util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Select from '@/components/ui/select/Select';
import { IProductFilter } from '@/interfaces/product-filter.interface';
import AppSortFilterModal from './app-sort-filter-modal/AppSortFilterModal';

type FilterCriteria = {
	fieldName: string;
	values: Array<string | number>;
	range: [number, number];
}[];

type AppSortFilterProps = {
	initialFilter: IProductFilter;
};

function AppSortFilter({ initialFilter }: AppSortFilterProps) {
	const { filterCriteria, setFilterCriteria, setSortCriteria } = useSearchFilterCriteriaContext();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const fCriteria: FilterCriteria = React.useMemo(() => {
		return Object.entries(filterCriteria || {}).map(([fieldName, value]) => {
			if (Array.isArray(value)) {
				return { fieldName, values: value, range: [0, 0] };
			}
			if (typeof value === 'object' && value !== null && 'min' in value && 'max' in value) {
				return { fieldName, values: [], range: [value.min, value.max] };
			}
			return { fieldName, values: [], range: [0, 0] };
		});
	}, [filterCriteria]);

	const handleFilterSelectSubmit = (fieldName: string, values: Array<string | number>, range: [number, number]) => {
		const isRange = Array.isArray(range) && range.length === 2 && range[0] !== range[1];

		const newCriteria = fCriteria.filter((c) => c.fieldName !== fieldName);
		newCriteria.push({ fieldName, values, range });

		const newFilter = newCriteria.reduce<TFilterCriteria>((acc, c) => {
			const { fieldName, values, range } = c;
			const arrValues = toArray<string | number>(values);

			if (arrValues.length === 1 && typeof arrValues[0] === 'boolean') {
				acc[fieldName] = arrValues[0];
			} else if (arrValues.length > 0 && typeof arrValues[0] === 'string') {
				acc[fieldName] = arrValues as string[];
			} else if (arrValues.length > 0 && typeof arrValues[0] === 'number') {
				acc[fieldName] = arrValues as number[];
			} else if (isRange) {
				acc[fieldName] = {
					min: range[0],
					max: range[1],
				};
			}
			return acc;
		}, {});
		setFilterCriteria(newFilter);
	};

	const handleSortChange = (value: string | null) => {
		const [field, order] = value ? value.split(':') : ['default', ''];
		const found = initialFilter.fields.find((f) => f.fieldName === field);
		const isCustom = found?.sortType === 'custom';
		setSortCriteria(
			field === 'default'
				? {}
				: {
						[field]: {
							order: toNumber(order) as 1 | -1,
							customSortOrder: isCustom ? found.customSortOrder : undefined,
						},
				  }
		);
	};

	const handleModalVisibility = useCallback(
		(isOpen: boolean) => {
			setIsModalOpen(isOpen);
		},
		[setIsModalOpen]
	);

	return (
		<>
			<section className={clsx(styles.appSortFilter, styles['appSortFilter--default'], 'not-fill-width-mobile')}>
				<div className={styles['appSortFilter__main-actions']}>
					<button
						className={clsx(
							styles['appSortFilter__main-actions__filter'],
							styles['appSortFilter__main-actions__item']
						)}
						onClick={() => setIsModalOpen(!isModalOpen)}
					>
						<FontAwesomeIcon icon={faFilter} />
					</button>

					<Select
						options={initialFilter.fields
							.filter((f) => f.sortable)
							.flatMap((f) => {
								const type = f.sortType || 'alpha';
								const { isAlpha, isNum, isCustom } = {
									isAlpha: type === 'alpha',
									isNum: type === 'num',
									isCustom: type === 'custom',
								};

								return [
									{
										value: `${f.fieldName}:1`,
										label: `${f.label} (${isAlpha ? 'A-Z' : 'Tăng dần'})`,
									},
									{
										value: `${f.fieldName}:-1`,
										label: `${f.label} (${isAlpha ? 'Z-A' : 'Giảm dần'})`,
									},
								];
							})}
						placeholder={'Sắp xếp'}
						onSelect={handleSortChange}
						selectedValue={null}
						customClassName={{
							select: styles['appSortFilter__main-actions__sort'],
							trigger: styles['appSortFilter__main-actions__item'],
							dropdown: '',
							item: '',
						}}
					/>
				</div>

				<ul className={styles.appSortFilter__list}>
					{initialFilter.fields
						.filter((f) => f.filterable)
						.map((field) => (
							<FilterSelect
								key={`AppSortFilter__${field.fieldName}`}
								field={field}
								filterCriteria={filterCriteria}
								onSubmit={handleFilterSelectSubmit}
							/>
						))}
				</ul>
			</section>
			<AppSortFilterModal isOpen={isModalOpen} setOpen={handleModalVisibility} initialFilter={initialFilter} />
		</>
	);
}

export default AppSortFilter;
