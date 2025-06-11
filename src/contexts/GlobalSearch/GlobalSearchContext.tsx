'use client';
import { createContext, Dispatch, SetStateAction } from 'react';
import { IProduct, PaginatedResult, TSearchCriteria } from '@/interfaces';

type GlobalSearchContextType = {
	keyword: TSearchCriteria;
	setKeyword: Dispatch<SetStateAction<TSearchCriteria>>;
	page: number;
	setPage: Dispatch<SetStateAction<number>>;
	limit: number;
	setLimit: Dispatch<SetStateAction<number>>;
	result: PaginatedResult<IProduct[]> | null;
	isLoading: boolean;
	resetSearch: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextType>({
	keyword: '',
	setKeyword: () => {},
	page: 1,
	setPage: () => {},
	limit: 5,
	setLimit: () => {},
	result: null,
	isLoading: false,
	resetSearch: () => {},
});

export default GlobalSearchContext;
