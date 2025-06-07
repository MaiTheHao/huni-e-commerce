import React from 'react';
import styles from './AppFooter.module.scss';
import AppFooterInfomation from './AppFooterInfomation';
import AppFooterDirection from './AppFooterDirection';
import AppFooterSocials from './AppFooterSocials';

type AppFooterProps = {};

function AppFooter({}: AppFooterProps) {
	return (
		<footer className={`app-container ${styles.container}`}>
			<section className={`app-block ${styles.main}`}>
				<AppFooterInfomation />
				<AppFooterDirection />
			</section>

			<div className={`app-container ${styles.copyright}`}>
				<section className={`app-block ${styles.copyrightBlock}`}>
					<span>© 2025 Huni Keyboards. Đã đăng ký bản quyền</span>
					<AppFooterSocials iconClassName={styles.copyrightIcon} />
				</section>
			</div>
		</footer>
	);
}

export default AppFooter;
