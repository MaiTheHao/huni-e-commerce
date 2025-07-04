'use client';
import React, { memo, useEffect, useRef, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Select.module.scss';
import clsx from 'clsx';
import { calcOptimalPosition } from '@/util/calcOptimalPosition';

type SelectProps = {
	options: { value: string | null; label: string }[];
	defaultValue?: string | null;
	defaultLabel?: string;
	customFaIcon?: any;
	placeholder?: string;
	onSelect?: (value: string | null) => void;
	searchable?: boolean;
	selectedValue?: any | null;
	customClassName?: {
		select?: string;
		trigger?: string;
		dropdown?: string;
		item?: string;
		search?: string;
	};
};

function Select({ options, placeholder = 'Select', onSelect, selectedValue = null, defaultValue = null, defaultLabel = 'Mặc định', customFaIcon, searchable = false, customClassName }: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [selectedOption, setSelectedOption] = useState<string | null>(selectedValue);
	const selectRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLUListElement>(null);
	const isFirstRender = useRef(true);
	const optimalHorizontalPosition: 'left' | 'right' = calcOptimalPosition(selectRef, dropdownRef, 'right') as 'left' | 'right';

	const handleOptionClick = (value: string | null) => {
		setSelectedOption(value);
		setIsOpen(false);
		onSelect?.(value);
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	useEffect(() => {
		const hasDefault = options.some((option) => option.value === defaultValue && option.label === defaultLabel);
		const newOptions = hasDefault ? [...options] : [{ value: defaultValue, label: defaultLabel }, ...options];
		setFilteredOptions(newOptions);
	}, [options]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	useEffect(() => {
		if (searchable) {
			const filtered = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
			setFilteredOptions(filtered);
		}
	}, [searchTerm, options, searchable]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		setSelectedOption(selectedValue);
	}, [selectedValue]);

	const selectedLabel = selectedOption ? filteredOptions.find((opt) => opt.value === selectedOption)?.label : placeholder;
	return (
		<div ref={selectRef} className={clsx(styles.select, customClassName?.select)} aria-label={`Select ${placeholder}`} title={`${placeholder}`}>
			<button type='button' className={clsx(styles.trigger, { [styles.null]: !selectedOption }, customClassName?.trigger)} onClick={toggleDropdown} aria-expanded={isOpen}>
				{selectedLabel}
				{customFaIcon || <FontAwesomeIcon icon={faChevronDown} className={`${styles.chevron} ${isOpen ? styles.rotated : null}`} />}
			</button>

			<ul
				className={clsx(styles.dropdown, customClassName?.dropdown, {
					[styles.left]: optimalHorizontalPosition === 'left',
					[styles.right]: optimalHorizontalPosition === 'right',
					[styles.open]: isOpen,
				})}
				ref={dropdownRef}
			>
				{searchable && (
					<li className={clsx(styles.searchItem, customClassName?.search)}>
						<input type='text' placeholder='Tìm kiếm...' value={searchTerm} onChange={handleSearchChange} />
					</li>
				)}
				{filteredOptions.map(
					(option, idx) =>
						option.value !== selectedOption && (
							<li
								key={`option-${idx}-${option.label}-${placeholder}-${customClassName}`}
								className={clsx(styles.item, customClassName?.item)}
								onClick={() => handleOptionClick(option.value)}
							>
								{option.label}
							</li>
						)
				)}
			</ul>
		</div>
	);
}

export default memo(Select);
