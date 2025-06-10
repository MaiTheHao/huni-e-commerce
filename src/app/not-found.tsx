import React from 'react';
import styles from './not-found.module.scss';
import AppBody from '@/components/layout/app-body/AppBody';

function RootNotFound() {
	return (
		<AppBody>
			<div className={styles.notFound}>
				<h1 className={styles.title}>404 - Not Found</h1>
				<p className={styles.message}>Trang bạn đang tìm kiếm không tồn tại.</p>
			</div>
		</AppBody>
	);
}

export default RootNotFound;
