'use client';
import React from 'react';
import AppHeaderRightSide from './AppHeaderRightSide';
import AppHeaderLeftSide from './AppHeaderLeftSide';
import styles from './AppHeader.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

type AppHeaderProps = {};

function AppHeader({}: AppHeaderProps) {
	return (
		<div className={`app-container ${styles.container}`}>
			<header className={`app-container ${styles.header}`}>
				<section className={`app-block ${styles.header__block}`}>
					<AppHeaderLeftSide />
					<AppHeaderRightSide />
				</section>
			</header>
			<div className={styles['header__search-container']}>
				<div className={styles['header__search']}>
					<input
						id='global-search'
						type='text'
						placeholder='Tìm kiếm...'
						className={styles['header__search__input']}
					/>
					<label className={styles['header__search__button']} aria-label='Search' htmlFor='global-search'>
						<FontAwesomeIcon icon={faSearch} />
					</label>
				</div>
			</div>
		</div>
	);
}

export default AppHeader;
