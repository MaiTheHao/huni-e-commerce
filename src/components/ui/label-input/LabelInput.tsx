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
	onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

function LabelInput({ label, name, required = false, type = 'text', placeholder, value, onChange, className }: LabelInputProps) {
	return (
		<label className={`${styles.label} ${className}`} htmlFor={name}>
			<span className={styles.labelText}>
				{label}
				<span className={styles.required}>{required ? '*' : ''}</span>
			</span>
			{type === 'textarea' ? (
				<textarea className={styles.textarea} name={name} required={required} placeholder={placeholder} value={value} onChange={onChange} />
			) : (
				<input className={styles.input} type={type} name={name} required={required} placeholder={placeholder} value={value} onChange={onChange} />
			)}
		</label>
	);
}

export default memo(LabelInput);
