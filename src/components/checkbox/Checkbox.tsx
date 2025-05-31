import React, { useState, useEffect } from 'react';
import styles from './Checkbox.module.scss';
import clsx from 'clsx';

type CheckboxProps = {
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	label?: React.ReactNode;
	id?: string;
	name?: string;
	disabled?: boolean;
	unDiscard?: boolean;
	className?: string;
};

function Checkbox({
	checked = false,
	onChange,
	label,
	id = 'checkbox',
	name,
	disabled = false,
	unDiscard = false,
	className,
}: CheckboxProps) {
	const [isChecked, setIsChecked] = useState(checked);

	useEffect(() => {
		setIsChecked(checked);
	}, [checked]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		if (unDiscard && isChecked && !e.target.checked) {
			return;
		}
		setIsChecked(e.target.checked);
		onChange?.(e.target.checked);
	};

	return (
		<label htmlFor={id} className={clsx(styles.label, className, { [styles.disabled]: disabled })}>
			<input
				type='checkbox'
				id={id}
				name={name}
				checked={isChecked}
				onChange={handleChange}
				disabled={disabled}
				className={styles.hiddenInput}
			/>
			<div className={clsx(styles.checkbox)}>{isChecked && <span className={styles.checked} />}</div>
			{label && <span className={styles.title}>{label}</span>}
		</label>
	);
}

export default Checkbox;
