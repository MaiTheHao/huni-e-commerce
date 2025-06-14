import React, { useState, useEffect } from 'react';
import styles from './Checkbox.module.scss';
import clsx from 'clsx';

/**
 * Các thuộc tính cho component Checkbox
 * @typedef {Object} CheckboxProps
 * @property {string} [id] - ID của checkbox, mặc định là 'checkbox'
 * @property {string} [name] - Tên của checkbox
 * @property {React.ReactNode} [label] - Nhãn hiển thị bên cạnh checkbox
 * @property {boolean} [checked] - Trạng thái đã chọn của checkbox, mặc định là false
 * @property {boolean} [disabled] - Trạng thái vô hiệu hóa checkbox, mặc định là false
 * @property {boolean} [preventUncheck] - Ngăn không cho bỏ chọn checkbox, mặc định là false
 * @property {string} [className] - Class CSS tùy chỉnh cho checkbox
 * @property {(checked: boolean) => void} [onChange] - Callback khi trạng thái checkbox thay đổi
 */
type CheckboxProps = {
	id?: string;
	label?: React.ReactNode;
	checked?: boolean;
	disabled?: boolean;
	preventUncheck?: boolean;
	className?: string;
	onChange?: () => void;
};

function Checkbox({ id = 'checkbox', label, checked = false, disabled = false, preventUncheck = false, className, onChange }: CheckboxProps) {
	const [isChecked, setIsChecked] = useState(checked);

	useEffect(() => {
		setIsChecked(checked);
	}, [checked]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;

		// Nếu preventUncheck là true và checkbox đang được chọn, không cho phép bỏ chọn
		if (preventUncheck && isChecked && !e.target.checked) {
			return;
		}

		setIsChecked(e.target.checked);
		onChange?.();
	};

	return (
		<label
			htmlFor={id}
			className={clsx(className, styles.checkbox, {
				[styles['checkbox--disabled']]: disabled,
			})}
		>
			<input type='checkbox' id={id} name={id} checked={isChecked} onChange={handleChange} disabled={disabled} className={styles['checkbox__input']} />
			<div className={styles['checkbox__box']}>{isChecked && <span className={styles['checkbox__checked']} />}</div>
			{label && <span className={styles['checkbox__title']}>{label}</span>}
		</label>
	);
}

export default Checkbox;
