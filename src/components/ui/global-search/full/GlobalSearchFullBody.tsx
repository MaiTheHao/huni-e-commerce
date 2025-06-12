'use client';
import React from 'react';
import styles from './GlobalSearchFullBody.module.scss';
import useGlobalSearchContext from '@/contexts/GlobalSearch/useGlobalSearchContext';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Spinner from '../../spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import GlobalSearchResult from '../GlobalSearchResult';

type GlobalSearchFullBodyProps = {
	debounceTime?: number;
};

function GlobalSearchFullBody({ debounceTime = 350 }: GlobalSearchFullBodyProps) {
	const { keyword, setKeyword, page, setPage, result, isLoading, resetSearch } = useGlobalSearchContext();
	const [input, setInput] = useState(keyword);
	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setInput(keyword);
	}, [keyword]);

	useEffect(() => {
		const handler = setTimeout(() => {
			if (input !== keyword) {
				setKeyword(input);
			}
		}, debounceTime);
		return () => clearTimeout(handler);
	}, [input, setKeyword, keyword, debounceTime]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				resetSearch();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('touchstart', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('touchstart', handleClickOutside);
		};
	}, [resetSearch]);

	const handleShowMore = () => {
		if (result && page < result.pagination.totalPages) setPage(page + 1);
	};

	const isShowable = !!(result && result.data && result.data.length > 0);
	const isMorePages = !!(result && result.pagination && page < result.pagination.totalPages);

	return (
		<div ref={searchRef} className={styles['gs-wrap']}>
			<div className={styles['gs']}>
				<input type='text' placeholder='Tìm kiếm...' value={input} onChange={handleInputChange} className={styles['gs-input']} />
				<button className={styles['gs-btn']} aria-label='Search'>
					{isLoading ? <Spinner className={styles.icon} /> : <FontAwesomeIcon icon={faSearch} className={styles.icon} />}
				</button>
			</div>
			<GlobalSearchResult
				isShowable={isShowable}
				result={result}
				isMorePages={isMorePages}
				isLoading={isLoading}
				handleShowMore={handleShowMore}
				className={clsx(styles['gs-results'], 'mobile-not-border-radius')}
			/>
		</div>
	);
}

export default GlobalSearchFullBody;
