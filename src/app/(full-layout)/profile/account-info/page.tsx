'use client';
import styles from '../Profile.module.scss';
import React from 'react';
import AccountInfoActions from './AccountInfoActions';
import AccountInfoLinkedAccounts from './AccountInfoLinkedAccounts';
import AccountInfoDetail from './AccountInfoDetail';

export default function AccountInfoClient() {
	return (
		<>
			<AccountInfoDetail />
			<div className={`${styles['list-part--horizontal']} ${styles.AdditionalInfo}`}>
				<AccountInfoActions />
				<AccountInfoLinkedAccounts />
			</div>
		</>
	);
}
