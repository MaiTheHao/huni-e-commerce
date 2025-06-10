'use client';
import React, { useState, useCallback, useEffect } from 'react';
import ModalSideBar from '@/components/ui/modal-sidebar/ModalSideBar';
import Checkbox from '@/components/ui/checkbox/Checkbox';
import styles from './AppSortFilterModal.module.scss';
import { IProductFilter, TFilterCriteria } from '@/interfaces';
import useSearchFilterCriteriaContext from '@/contexts/SearchFilterCriteriaContext/useSearchFilterCriteriaContext';
import clsx from 'clsx';
import PriceRangeSlider from '../price-range-slider/PriceRangeSlider';

type AppSortFilterModalProps = {
	initialFilter: IProductFilter;
	isOpen?: boolean;
	setOpen?: (isOpen: boolean) => void;
};

type FieldType = {
	fieldName: string;
	label: string;
	type: string;
	filterable: boolean;
	options: any[];
};

const AppSortFilterModal: React.FC<AppSortFilterModalProps> = ({ initialFilter, isOpen = false, setOpen = () => {} }) => {
	const { filterCriteria, setFilterCriteria } = useSearchFilterCriteriaContext();
	const [localFilterCriteria, setLocalFilterCriteria] = useState<TFilterCriteria>({});

	const handleValuesChange = useCallback(
		(fieldName: string, value: string) => {
			const currentValues = localFilterCriteria[fieldName] || [];
			const isChecked = (currentValues as Array<string>).includes(value);
			const newValues = (currentValues as Array<string>).filter((v) => v !== value);
			if (!isChecked) newValues.push(value);
			setLocalFilterCriteria((prev) => ({
				...prev,
				[fieldName]: newValues,
			}));
		},
		[localFilterCriteria]
	);

	const handleRangeChange = useCallback((fieldName: string, value: [number, number]) => {
		setLocalFilterCriteria((prev) => ({
			...prev,
			[fieldName]: { min: value[0], max: value[1] },
		}));
	}, []);

	const handleReset = () => {
		setFilterCriteria({});
		setLocalFilterCriteria({});
		setOpen(false);
	};

	const handleSubmit = () => {
		setFilterCriteria(localFilterCriteria);
		setOpen(false);
	};

	const renderOptionsField = (field: FieldType) => {
		const { fieldName, options } = field;
		return (
			<ul className={styles.modal__options}>
				{options.map((option: any) => {
					const value = typeof option === 'object' ? option.value : option;
					const label = typeof option === 'object' ? option.label : String(option);
					return (
						<li key={value} className={styles.modal__option}>
							<Checkbox
								id={`${fieldName}_${value}`}
								label={label}
								checked={Array.isArray(localFilterCriteria[fieldName]) && (localFilterCriteria[fieldName] as unknown[]).includes(value)}
								onChange={() => handleValuesChange(fieldName, value)}
							/>
						</li>
					);
				})}
			</ul>
		);
	};

	const renderRangeField = (field: FieldType) => {
		const { fieldName, options } = field;
		const currentRange = filterCriteria[fieldName] as { min: number; max: number } | undefined;
		const [min, max] = options as [number, number];
		return <PriceRangeSlider min={min} max={max} currentRange={[currentRange?.min ?? min, currentRange?.max ?? max]} onChange={(value) => handleRangeChange(fieldName, value)} />;
	};

	const renderField = (field: FieldType) => {
		const { fieldName, label, type, filterable } = field;
		if (!filterable) return null;
		return (
			<li key={fieldName} className={styles.modal__item}>
				<span className={styles.modal__label}>{label}</span>
				{type === 'range' ? renderRangeField(field) : renderOptionsField(field)}
			</li>
		);
	};

	useEffect(() => {
		setLocalFilterCriteria(filterCriteria);
	}, [filterCriteria]);

	return (
		<ModalSideBar
			title='Bộ lọc'
			isOpen={isOpen}
			setOpen={setOpen}
			className={styles.modal}
			contentClassName={styles.modal__content}
			stickyFooter={
				<div className={styles.modal__actions}>
					<button onClick={handleReset} className={clsx(styles['modal__actions__action'], styles['modal__actions__action--cancel'], 'cta-button--outlined')}>
						Hủy
					</button>
					<button onClick={handleSubmit} className={clsx(styles['modal__actions__action'], styles['modal__actions__action--submit'], 'cta-button')}>
						Xem kết quả
					</button>
				</div>
			}
		>
			<ul className={styles.modal__list}>{initialFilter.fields.map((field) => renderField(field))}</ul>
		</ModalSideBar>
	);
};

const areEqual = (
	prevProps: { initialFilter: IProductFilter; isOpen?: boolean; setOpen?: (isOpen: boolean) => void },
	nextProps: { initialFilter: IProductFilter; isOpen?: boolean; setOpen?: (isOpen: boolean) => void }
) => {
	return prevProps.isOpen === nextProps.isOpen && JSON.stringify(prevProps.initialFilter) === JSON.stringify(nextProps.initialFilter) && prevProps.setOpen === nextProps.setOpen;
};

export default React.memo(AppSortFilterModal, areEqual);
