'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './FilterSelect.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import PriceRangeSlider from '../price-range-slider/PriceRangeSlider';
import { calcOptimalPosition } from '@/util/calcOptimalPosition';
import Checkbox from '@/components/ui/checkbox/Checkbox';
import type { IProductFilter, TFilterCriteria } from '@/interfaces';

export type FilterSelectProps = {
	field: IProductFilter['fields'][number];
	filterCriteria?: TFilterCriteria;
	onSubmit?: (fieldName: string, values: Array<string | number>, range: [number, number]) => void;
};

function FilterSelect({ field, filterCriteria = {}, onSubmit }: FilterSelectProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [values, setValues] = useState<Array<string | number>>([]);

	useEffect(() => {
		if (field.type === 'range' || field.type === 'boolean') return;
		setValues((prev) => [...new Set([...prev, ...((filterCriteria[field.fieldName] as Array<any>) || [])])]);
	}, [filterCriteria, field.fieldName, field.type]);

	const [optimalHorizontalPosition, setOptimalHorizontalPosition] = useState<'left' | 'right'>('right');
	const [range, setRange] = useState<[number, number]>(field.type === 'range' && Array.isArray(field.options) ? [field.options[0] as number, field.options[1] as number] : [0, 0]);
	const filterSelectRef = useRef<HTMLDivElement>(null);
	const filterSelectModalRef = useRef<HTMLDivElement>(null);

	const hasOption = Array.isArray(field.options) && typeof field.options[0] === 'object';
	const hasRange = field.type === 'range' && Array.isArray(field.options) && typeof field.options[0] === 'number';

	const isFiltered = Array.isArray(filterCriteria[field.fieldName]) && (filterCriteria[field.fieldName] as Array<string | number>).length > 0;

	const handleValues = (value: string | number) => {
		setValues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
	};

	const handleRange = (value: [number, number]) => {
		setRange(value);
	};

	const handleOpen = () => {
		if (!isOpen) {
			setIsOpen(true);
			setOptimalHorizontalPosition(calcOptimalPosition(filterSelectRef, filterSelectModalRef, 'right', 0.2) as 'left' | 'right');
		} else {
			setIsOpen(false);
		}
	};

	const handleSubmit = () => {
		onSubmit?.(field.fieldName, values, range);
	};

	const handleCancel = () => {
		// const newCriteria = filterCriteria;
		// delete newCriteria[field.fieldName];
		// setFilterCriteria(newCriteria);
		setValues([]);
		onSubmit?.(field.fieldName, [], [0, 0]);
	};

	const renderOptions = () => {
		if (!hasOption) return null;
		const options = field.options as { value: string; label: string }[];
		return (
			<ul className={styles.filterSelector__wrapper__options}>
				{options.map((option) => (
					<li key={`${field.fieldName}:${option.value}`} className={styles.filterSelector__wrapper__options__item}>
						<Checkbox id={`${field.fieldName}:${option.value}`} label={option.label} checked={values.includes(option.value)} onChange={() => handleValues(option.value)} />
					</li>
				))}
			</ul>
		);
	};

	const renderRange = () => {
		if (!hasRange) return null;
		const [min, max] = field.options as [number, number];
		return (
			<div className={styles.filterSelector__wrapper__range}>
				<PriceRangeSlider min={min} max={max} debounceTime={0} onChange={([min, max]) => handleRange([min, max])} />
			</div>
		);
	};

	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (filterSelectRef.current && !filterSelectRef.current.contains(e.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className={styles.filterSelector} ref={filterSelectRef}>
			<button
				className={clsx(styles.filterSelector__button, {
					[styles.active]: isOpen,
					[styles.hasValue]: isFiltered,
				})}
				onClick={() => handleOpen()}
			>
				<span>{field.label}</span>
				<span>
					<FontAwesomeIcon icon={faChevronDown} />
				</span>
			</button>
			<div
				className={clsx(styles.filterSelector__wrapper, {
					[styles.open]: isOpen,
					[styles.left]: optimalHorizontalPosition === 'left',
					[styles.right]: optimalHorizontalPosition === 'right',
				})}
				ref={filterSelectModalRef}
			>
				{renderOptions()}
				{renderRange()}
				<div className={styles.filterSelector__actions}>
					{(!hasRange || (hasRange && hasOption)) && (
						<button className={clsx(styles.filterSelector__actions__button, styles.cancel)} onClick={() => handleCancel()}>
							Hủy
						</button>
					)}
					<button className={clsx(styles.filterSelector__actions__button, styles.submit)} onClick={() => handleSubmit()}>
						Lọc
					</button>
				</div>
			</div>
		</div>
	);
}

export default FilterSelect;
