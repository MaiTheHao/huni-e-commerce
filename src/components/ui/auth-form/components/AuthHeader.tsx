'use client';
import React, { memo } from 'react';
import styles from '../AuthForm.module.scss';

type AuthHeaderProps = {
	title: string;
	subtitle: string;
};

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
	return (
		<div className={styles.AuthPage__header}>
			<h2>{title}</h2>
			<span>{subtitle}</span>
		</div>
	);
};

export default memo(AuthHeader);
