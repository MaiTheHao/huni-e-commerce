'use client';
import React, { useState, ReactNode, useMemo } from 'react';
import SearchFilterCriteriaContext from './SearchFilterCriteriaContext';
import { TFilterCriteria, TSortCriteria, TSearchCriteria } from '@/interfaces';

type Props = {
	children: ReactNode;
};

const SearchFilterCriteriaContextProvider = ({ children }: Props) => {
	const [searchKeyword, setSearchKeyword] = useState<TSearchCriteria>('');
	const [filterCriteria, setFilterCriteria] = useState<TFilterCriteria>({});
	const [sortCriteria, setSortCriteria] = useState<TSortCriteria>({});

	const contextValue = useMemo(
		() => ({
			searchKeyword,
			setSearchKeyword,
			filterCriteria,
			setFilterCriteria,
			sortCriteria,
			setSortCriteria,
		}),
		[searchKeyword, filterCriteria, sortCriteria]
	);

	return <SearchFilterCriteriaContext.Provider value={contextValue}>{children}</SearchFilterCriteriaContext.Provider>;
};

export default SearchFilterCriteriaContextProvider;
