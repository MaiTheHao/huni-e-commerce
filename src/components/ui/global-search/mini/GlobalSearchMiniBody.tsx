'use client';
import styles from './GlobalSearchMiniBody.module.scss';
import useGlobalSearchContext from '@/contexts/GlobalSearch/useGlobalSearchContext';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import GlobalSearchResult from '../GlobalSearchResult';
import Spinner from '../../spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

type GlobalSearchMiniBodyProps = {
	debounceTime?: number;
};

function GlobalSearchMiniBody({ debounceTime = 350 }: GlobalSearchMiniBodyProps) {
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
	}, [input, isSearchOpen, setKeyword, keyword, debounceTime]);

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
				resetSearch();
				setIsSearchOpen(false);
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
			<GlobalSearchResult isShowable={isShowable} result={result} isMorePages={isMorePages} isLoading={isLoading} handleShowMore={handleShowMore} className={styles['gs-results']} />
		</div>
	);
}

export default GlobalSearchMiniBody;
