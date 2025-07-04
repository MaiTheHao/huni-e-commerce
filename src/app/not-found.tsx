import React from 'react';
import styles from './not-found.module.scss';

function NotFound({ message = 'Trang bạn đang tìm kiếm không tồn tại.' }: { message?: string }) {
	return (
		<div className={styles.notFound}>
			<h1 className={styles.title}>404 - Not Found</h1>
			<p className={styles.message}>{message}</p>
		</div>
	);
}

export default NotFound;
