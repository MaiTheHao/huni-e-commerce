import React, { memo } from 'react';
import styles from './LabelInput.module.scss';

type LabelInputProps = {
	label?: string;
	placeholder?: string;
	name?: string;
	required?: boolean;
	type?: 'text' | 'email' | 'textarea' | 'password';
	value?: string;
	className?: string;
	validateError?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function LabelInput({ label, name, required = false, type = 'text', placeholder, value, onChange, className, validateError }: LabelInputProps) {
	const isValidateError = validateError && validateError.trim() !== '';
	return (
		<label className={`${styles.label} ${className} ${isValidateError ? styles.invalid : ''}`} htmlFor={name}>
			<span className={styles.labelText}>
				{label}
				<span className={styles.required}>{required ? '*' : ''}</span>
			</span>
			{type === 'textarea' ? (
				<textarea className={styles.textarea} name={name} required={required} placeholder={placeholder} value={value || ''} onChange={onChange} />
			) : (
				<input className={styles.input} type={type} name={name} required={required} placeholder={placeholder} value={value || ''} onChange={onChange} />
			)}
			{isValidateError && <span className={`${styles.validateError} error`}>{validateError}</span>}
		</label>
	);
}

export default memo(LabelInput);
