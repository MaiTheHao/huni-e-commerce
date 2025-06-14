import React from 'react';
import styles from '../AuthForm.module.scss';
import LabelInput from '@/components/ui/label-input/LabelInput';
import { InputFieldConfig } from '../types';

type AuthFormFieldsProps = {
	fields: InputFieldConfig[];
	formData: Record<string, string>;
	validateError: Record<string, string>;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const AuthFormFields = ({ fields, formData, validateError, handleInputChange }: AuthFormFieldsProps) => {
	return (
		<>
			{fields.map((field, index) => (
				<div key={index} className={styles.AuthPage__body__form__field}>
					<LabelInput
						key={`AuthPage__body__form__field:${field.label}`}
						name={field.name}
						type={field.type || 'text'}
						label={field.label}
						placeholder={field.placeholder}
						value={formData[field.name] || ''}
						onChange={handleInputChange}
						className={`${styles.AuthPage__body__form__field__input} ${validateError[field.name] ? styles.invalid : ''}`}
						required={field.required}
					/>
					{validateError[field.name] && (
						<span key={`AuthPage__body__form__field__error:${field.label}`} className={styles.AuthPage__body__form__field__error}>
							{validateError[field.name]}
						</span>
					)}
				</div>
			))}
		</>
	);
};

export default AuthFormFields;
