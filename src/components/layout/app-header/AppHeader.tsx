'use client';
import React from 'react';
import AppHeaderRightSide from './AppHeaderRightSide';
import AppHeaderLeftSide from './AppHeaderLeftSide';
import styles from './AppHeader.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import GlobalSearch from '@/components/ui/global-search/GlobalSearch';

function AppHeader() {
	return (
		<div className={`app-container ${styles['app-header']}`}>
			<header className={`app-container ${styles['app-header__main']}`}>
				<section className={`app-block ${styles['app-header__content']}`}>
					<AppHeaderLeftSide />
					<AppHeaderRightSide />
				</section>
			</header>
			<div className={styles['app-header__global-search']}>
				<div className={styles['app-header__global-search-form']}>
					<input id='global-search' type='text' placeholder='Tìm kiếm...' className={styles['app-header__global-search-input']} />
					<label className={styles['app-header__global-search-btn']} aria-label='Search' htmlFor='global-search'>
						<FontAwesomeIcon icon={faSearch} />
					</label>
				</div>
			</div>
			{/* <GlobalSearch isFull /> */}
		</div>
	);
}

export default AppHeader;
