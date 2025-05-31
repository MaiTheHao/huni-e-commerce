'use client';
import React, { memo, useEffect, useRef, useState } from 'react';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Select.module.scss';
import clsx from 'clsx';

export type SelectProps = {
	options: { value: string; label: string }[];
	customFaIcon?: React.ReactNode;
	placeholder?: string;
	onSelect?: (value: string) => void;
	searchable?: boolean;
	selectedValue?: string | null;
	customClassName?: {
		select?: string;
		trigger?: string;
		dropdown?: string;
		item?: string;
		search?: string;
	};
};

function Select({
	options,
	placeholder = 'Select',
	onSelect,
	selectedValue = null,
	searchable = false,
	customFaIcon,
	customClassName,
}: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredOptions, setFilteredOptions] = useState(options);
	const [selectedOption, setSelectedOption] = useState<string | null>(selectedValue);
	const selectRef = useRef<HTMLDivElement>(null);
	const isFirstRender = useRef(true);

	const handleOptionClick = (value: string) => {
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
		setFilteredOptions(options);
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

	const selectedLabel = selectedOption ? options.find((opt) => opt.value === selectedOption)?.label : placeholder;
	return (
		<div
			ref={selectRef}
			className={clsx(styles.select, customClassName?.select)}
			aria-label={`Select ${placeholder}`}
		>
			<button
				type='button'
				className={clsx(styles.trigger, { [styles.null]: !selectedOption }, customClassName?.trigger)}
				onClick={toggleDropdown}
				aria-expanded={isOpen}
			>
				{selectedLabel}
				{customFaIcon || (
					<FontAwesomeIcon
						icon={faChevronDown}
						className={`${styles.chevron} ${isOpen ? styles.rotated : null}`}
					/>
				)}
			</button>

			{isOpen && (
				<ul className={clsx(styles.dropdown, customClassName?.dropdown)}>
					{searchable && (
						<li className={clsx(styles.searchItem, customClassName?.search)}>
							<input
								type='text'
								placeholder='Tìm kiếm...'
								value={searchTerm}
								onChange={handleSearchChange}
							/>
						</li>
					)}

					{filteredOptions.map(
						(option) =>
							option.value !== selectedOption && (
								<li
									key={option.value}
									className={clsx(styles.item, customClassName?.item)}
									onClick={() => handleOptionClick(option.value)}
								>
									{option.label}
								</li>
							)
					)}
				</ul>
			)}
		</div>
	);
}

export default memo(Select);
