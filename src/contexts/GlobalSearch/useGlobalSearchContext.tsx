'use client';
import { useContext } from 'react';
import GlobalSearchContext from './GlobalSearchContext';

export default function useGlobalSearchContext() {
	const context = useContext(GlobalSearchContext);
	if (!context) {
		throw new Error('useGlobalSearchContext nên được sử dụng trong GlobalSearchContextProvider');
	}
	return context;
}
