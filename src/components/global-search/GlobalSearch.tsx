'use client';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './GlobalSearch.module.scss';
import React, { useState } from 'react';
import clsx from 'clsx';

type Props = {
	headerStyles: { [key: string]: string };
	isInner?: boolean;
};

function GlobalSearch({ headerStyles, isInner }: Props) {
	const [keyword, setKeyword] = useState<string>('');
	const isKeywordEmpty = keyword.trim() === '';

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setKeyword(e.target.value);
	};

	return (
		<div
			aria-label='Tìm kiếm cục bộ'
			className={clsx(headerStyles.link, styles.search, {
				[headerStyles.innerGlobalSearch]: isInner,
				[styles.full]: !isInner,
			})}
		>
			<input
				type='text'
				placeholder='Tìm kiếm'
				className={clsx(styles.input, {
					[styles.empty]: isKeywordEmpty,
				})}
				value={keyword}
				onChange={handleChange}
			/>
			<FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} />
		</div>
	);
}

export default GlobalSearch;
