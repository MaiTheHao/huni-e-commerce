import React from 'react';
import styles from './CheckBox.module.scss';
import clsx from 'clsx';

export type CheckBoxProps = {
	label: string;
	value: string;
	checked: boolean;
	onChange: (value: string, checked: boolean) => void; // Trả về cả value và checked
	customClasses?: {
		label?: string;
		checkbox?: string;
		title?: string;
	};
	disabled?: boolean;
};

function CheckBox({
	label,
	value,
	checked,
	onChange,
	disabled = false,
	customClasses = {
		label: '',
		checkbox: '',
		title: '',
	},
}: CheckBoxProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		const newChecked = e.target.checked;
		onChange(value, newChecked);
	};

	return (
		<label className={clsx(customClasses.label, styles.label, { [styles.disabled]: disabled })}>
			<input
				type='checkbox'
				value={value}
				checked={checked}
				onChange={handleChange}
				disabled={disabled}
				className={clsx(styles.hiddenInput)}
			/>
			<div
				className={clsx(customClasses.checkbox, styles.checkbox, {
					[styles.checked]: checked,
					[styles.disabled]: disabled,
				})}
			>
				{checked && <span className={styles.checkmark}>✓</span>}
			</div>
			<span className={clsx(customClasses.title, styles.title)}>{label}</span>
		</label>
	);
}

export default CheckBox;
