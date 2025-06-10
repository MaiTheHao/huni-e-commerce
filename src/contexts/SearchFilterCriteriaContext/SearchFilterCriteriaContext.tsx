'use client';
import { createContext } from 'react';
import { TFilterCriteria, TSortCriteria, TSearchCriteria } from '@/interfaces';

interface ISearchFilterCriteriaContext {
	searchKeyword: TSearchCriteria;
	setSearchKeyword: (keyword: TSearchCriteria) => void;
	filterCriteria: TFilterCriteria<string>;
	setFilterCriteria: (criteria: TFilterCriteria<string>) => void;
	sortCriteria: TSortCriteria<string>;
	setSortCriteria: (sort: TSortCriteria<string>) => void;
}

const SearchFilterCriteriaContext = createContext<ISearchFilterCriteriaContext>({
	searchKeyword: '',
	setSearchKeyword: () => {},
	filterCriteria: {},
	setFilterCriteria: () => {},
	sortCriteria: {},
	setSortCriteria: () => {},
});

export default SearchFilterCriteriaContext;
