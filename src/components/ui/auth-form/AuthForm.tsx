'use client';
import React, { useCallback, useState } from 'react';
import styles from './AuthForm.module.scss';
import { AuthFormProps } from './types';
import AuthHeader from './components/AuthHeader';
import AuthFormFields from './components/AuthFormFields';
import AuthAdditionalLink from './components/AuthAdditionalLink';
import AuthSubmitButton from './components/AuthSubmitButton';
import AuthOAuthProviders from './components/AuthOAuthProviders';
import AuthBottomText from './components/AuthBottomText';

function AuthForm({ title, subtitle, fields, submitText, submitDisabled, additionalLink, oauthProviders = [], bottomText, bottomLinkText, bottomLinkHref, validateSchema, onSubmit }: AuthFormProps) {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [submitable, setSubmitable] = useState<boolean>(false);
	const [validateError, setValidateError] = useState<Record<string, string>>({});

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;

			const fieldSchema = validateSchema.shape[name];
			const status = fieldSchema.safeParse(value);

			setValidateError((prev) => {
				const newValidateError = {
					...prev,
					[name]: status.success ? '' : status.error.errors[0].message,
				};

				setFormData((prevFormData) => {
					const newFormData = { ...prevFormData, [name]: value };

					const isSubmitable =
						Object.keys(newValidateError).every((key) => !newValidateError[key]) &&
						Object.keys(newFormData).length === fields.length &&
						Object.values(newFormData).every((val) => val.toString().trim() !== '');

					setSubmitable(isSubmitable);

					return newFormData;
				});

				return newValidateError;
			});
		},
		[fields.length]
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const result = validateSchema.safeParse(formData);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.errors.forEach((error) => {
				if (error.path[0]) {
					errors[error.path[0] as string] = error.message;
				}
			});
			setValidateError(errors);
			return;
		}

		setValidateError({});
		if (onSubmit) {
			onSubmit(formData);
		}
	};

	return (
		<div className={`${styles.AuthForm}`}>
			<AuthHeader title={title} subtitle={subtitle} />
			<div className={styles.AuthPage__body}>
				<form className={styles.AuthPage__body__form} onSubmit={handleSubmit}>
					<AuthFormFields fields={fields} formData={formData} validateError={validateError} handleInputChange={handleInputChange} />
					{additionalLink && (
						<ul className={styles.AuthPage__body__form__additionalLinks}>
							{Array.isArray(additionalLink) ? (
								additionalLink.map((link, index) => (
									<li key={index} className={styles.AuthPage__body__form__additionalLinks__item}>
										<AuthAdditionalLink text={link.text} href={link.href} />
									</li>
								))
							) : (
								<li className={styles.AuthPage__body__form__additionalLinks__item}>
									<AuthAdditionalLink text={additionalLink.text} href={additionalLink.href} />
								</li>
							)}
						</ul>
					)}
					<AuthSubmitButton text={submitText} submitable={submitable && !submitDisabled} />
				</form>
				<AuthOAuthProviders providers={oauthProviders} />
				<AuthBottomText text={bottomText} linkText={bottomLinkText} linkHref={bottomLinkHref} />
			</div>
		</div>
	);
}

export default AuthForm;
