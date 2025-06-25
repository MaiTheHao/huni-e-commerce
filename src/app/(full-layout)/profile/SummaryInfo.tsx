'use client';
import React from 'react';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import styles from './Profile.module.scss';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function SummaryInfo() {
	const authGuard = useAuthGuard({
		immediate: true,
		redirectTo: '/home',
	});
	const { user, isAuthenticated } = useAuthContext();

	return (
		<div className={`${styles['left__summary-info']} ${styles['left-item']} ${styles.part}`}>
			<div className={styles['left__summary-info__avatar']}>
				<img src={user?.avatar ? user.avatar : '/imgs/undefined_user.png'} alt={isAuthenticated && user?.name ? user.name : 'Khách'} />
			</div>
			<div className={styles['left__summary-info__details']}>
				<span className={styles['left__summary-info__details__name']}>{user?.name ? user.name : 'Tài khoản khách'}</span>
				{user?.email && <span className={styles['left__summary-info__details__email']}>{user?.email}</span>}
			</div>
		</div>
	);
}
