'use client';
import useGlobalSearchContext from '@/contexts/GlobalSearch/useGlobalSearchContext';
import styles from './GlobalSearchDesktopBody.module.scss';
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../spinner/Spinner';
import { calcDiscountPrice, toLocalePrice, toNumber } from '@/util';
import GlobalSearchResult from './GlobalSearchResult';

type GlobalSearchDesktopBodyProps = {
	debounceTime?: number;
};

function GlobalSearchDesktopBody({ debounceTime = 350 }: GlobalSearchDesktopBodyProps) {
	const { keyword, setKeyword, page, setPage, result, isLoading, resetSearch } = useGlobalSearchContext();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [input, setInput] = useState(keyword);
	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setInput(keyword);
	}, [keyword]);

	const toggleSearch = () => {
		setIsSearchOpen((open) => {
			if (open) {
				resetSearch();
			} else {
				setInput(keyword);
			}
			return !open;
		});
	};

	useEffect(() => {
		if (!isSearchOpen) return;
		const handler = setTimeout(() => {
			if (input !== keyword) {
				setKeyword(input);
			}
		}, debounceTime);
		return () => clearTimeout(handler);
	}, [input, isSearchOpen, setKeyword, keyword]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};

	const handleShowMore = () => {
		if (result && page < result.pagination.totalPages) setPage(page + 1);
	};

	const isShowable = !!(result && result.data && result.data.length > 0 && isSearchOpen);
	const isMorePages = !!(result && result.pagination && page < result.pagination.totalPages);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setIsSearchOpen(false);
				resetSearch();
			}
		};

		if (isSearchOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSearchOpen, resetSearch]);

	return (
		<div className={styles['gs-wrap']} ref={searchRef}>
			<div
				className={clsx(styles['gs'], {
					[styles['gs--open']]: isSearchOpen,
				})}
			>
				<input
					type='text'
					placeholder='Tìm kiếm...'
					value={input}
					onChange={handleInputChange}
					autoFocus={isSearchOpen}
					className={clsx(styles['gs-input'], {
						[styles['gs-input--active']]: isSearchOpen,
					})}
				/>
				<button className={styles['gs-btn']} aria-label='Search' onClick={toggleSearch}>
					{isLoading ? <Spinner className={styles.icon} /> : <FontAwesomeIcon icon={faSearch} className={styles.icon} />}
				</button>
			</div>
			<GlobalSearchResult
				isShowable={isShowable}
				result={result}
				isMorePages={isMorePages}
				isLoading={isLoading}
				setIsSearchOpen={setIsSearchOpen}
				resetSearch={resetSearch}
				handleShowMore={handleShowMore}
				toLocalePrice={toLocalePrice}
				calcDiscountPrice={calcDiscountPrice}
				toNumber={toNumber}
				Spinner={Spinner}
			/>
		</div>
	);
}

export default GlobalSearchDesktopBody;
