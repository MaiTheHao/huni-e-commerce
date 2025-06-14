'use client';
import React, { memo } from 'react';
import Link from 'next/link';
import styles from '../AuthForm.module.scss';

type AuthAdditionalLinkProps = {
	text: string;
	href: string;
};

const AuthAdditionalLink = ({ text, href }: AuthAdditionalLinkProps) => {
	return (
		<Link href={href} className={styles.AuthPage__body__form__addition}>
			{text}
		</Link>
	);
};

export default memo(AuthAdditionalLink);
