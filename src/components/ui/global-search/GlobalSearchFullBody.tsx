'use client';
import React from 'react';
import styles from './GlobalSearchFullBody.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

type Props = {};

function GlobalSearchFullBody({}: Props) {
	return (
		<div className={styles['gs']}>
			<div className={styles['gs__form']}>
				<input id='gs' type='text' placeholder='Tìm kiếm...' className={styles['gs__input']} />
				<label className={styles['gs__button']} aria-label='Search' htmlFor='gs'>
					<FontAwesomeIcon icon={faSearch} />
				</label>
			</div>
		</div>
	);
}

export default GlobalSearchFullBody;
