'use client';
import { useContext } from 'react';
import SearchFilterCriteriaContext from './SearchFilterCriteriaContext';

export default function useSearchFilterCriteriaContext() {
	const context = useContext(SearchFilterCriteriaContext);
	if (!context) {
		throw new Error('useSearchFilterCriteriaContext nên được sử dụng trong SearchFilterCriteriaContextProvider');
	}
	return context;
}
