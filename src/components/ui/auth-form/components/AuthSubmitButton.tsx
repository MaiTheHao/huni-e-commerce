'use client';
import React, { memo } from 'react';
import styles from '../AuthForm.module.scss';

type AuthSubmitButtonProps = {
	text: string;
	submitable: boolean;
};

const AuthSubmitButton = ({ text, submitable }: AuthSubmitButtonProps) => {
	return (
		<button type='submit' className={`${styles.AuthPage__body__form__btn} cta-button ${submitable ? '' : 'disabled'}`} disabled={!submitable}>
			{text}
		</button>
	);
};

export default memo(AuthSubmitButton);
