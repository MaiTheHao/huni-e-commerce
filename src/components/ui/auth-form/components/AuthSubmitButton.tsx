'use client';
import React, { memo } from 'react';
import styles from '../AuthForm.module.scss';
import Spinner from '../../spinner/Spinner';

type AuthSubmitButtonProps = {
	text: string;
	submitable: boolean;
	isLoading?: boolean;
};

const AuthSubmitButton = ({ text, submitable, isLoading }: AuthSubmitButtonProps) => {
	return (
		<button type='submit' className={`${styles.AuthPage__body__form__btn} cta-button--primary ${submitable ? '' : 'disabled'}`} disabled={!submitable}>
			{isLoading ? <Spinner /> : text}
		</button>
	);
};

export default memo(AuthSubmitButton);
