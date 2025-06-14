'use client';
import React, { memo } from 'react';
import Link from 'next/link';
import styles from '../AuthForm.module.scss';

type AuthBottomTextProps = {
	text?: string;
	linkText?: string;
	linkHref?: string;
};

const AuthBottomText = ({ text, linkText, linkHref }: AuthBottomTextProps) => {
	return (
		<span className={styles.AuthPage__body__addition}>
			{text && <span>{text}</span>}
			{linkText && linkHref && <Link href={linkHref}>{linkText}</Link>}
		</span>
	);
};

export default memo(AuthBottomText);
