'use client';
import React, { memo } from 'react';
import Image from 'next/image';
import styles from '../AuthForm.module.scss';
import { OAuthProvider } from '../types';

type AuthOAuthProvidersProps = {
	providers: OAuthProvider[];
};

const AuthOAuthProviders = ({ providers }: AuthOAuthProvidersProps) => {
	if (providers.length === 0) return null;

	return (
		<div className={styles.AuthPage__body__OAuth}>
			<span className={styles.AuthPage__body__OAuth__title}>
				<div></div>
				<span>Hoặc tiếp tục với</span>
				<div></div>
			</span>
			<ul className={styles.AuthPage__body__OAuth__items}>
				{providers.map((provider, index) => (
					<li key={index}>
						<a href={provider.href} target='_self' rel='noopener noreferrer'>
							<Image src={provider.iconSrc} alt={provider.name} width={24} height={24} />
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};

export default memo(AuthOAuthProviders);
