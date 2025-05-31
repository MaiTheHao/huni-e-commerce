'use client';
import React from 'react';
import AppHeaderRightSide from './AppHeaderRightSide';
import AppHeaderLeftSide from './AppHeaderLeftSide';
import styles from './AppHeader.module.scss';
import GlobalSearch from '../global-search/GlobalSearch';

type AppHeaderProps = {};

function AppHeader({}: AppHeaderProps) {
	return (
		<header className={`app-container ${styles.container}`}>
			<section className={`app-block ${styles.block}`}>
				<AppHeaderLeftSide />
				<AppHeaderRightSide />
			</section>
			<section className={`app-container ${styles.outerGlobalSearch}`}>
				<GlobalSearch headerStyles={styles} />
			</section>
		</header>
	);
}

export default AppHeader;
