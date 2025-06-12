'use client';
import React, { useState, useMemo, useEffect, ReactNode, useRef, useCallback } from 'react';
import { IProduct, IResponse, PaginatedResult, TSearchCriteria } from '@/interfaces';
import GlobalSearchContext from './GlobalSearchContext';
import { loggerService } from '@/services/logger.service';
import { isEmpty } from '@/util';

type GlobalSearchProviderProps = {
	children: ReactNode;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_LIMIT = 5;

const buildSearchUrl = (keyword: TSearchCriteria, page: number, limit: number): string => {
	if (!API_URL) throw new Error('API URL is not configured');
	return `${API_URL}/product/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`;
};

const fetchSearchResults = async (keyword: TSearchCriteria, page: number, limit: number, signal?: AbortSignal): Promise<PaginatedResult<IProduct[]>> => {
	const url = buildSearchUrl(keyword, page, limit);
	const response = await fetch(url, { signal });

	if (!response.ok) {
		throw new Error(`Search failed: ${response.statusText}`);
	}

	const data: IResponse<PaginatedResult<IProduct[]>> = await response.json();
	return data.data ?? { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
};

const GlobalSearchContextProvider = ({ children }: GlobalSearchProviderProps) => {
	const [result, setResult] = useState<PaginatedResult<IProduct[]> | null>(null);
	const [keyword, setKeyword] = useState<TSearchCriteria>('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [isLoading, setIsLoading] = useState(false);

	const abortControllerRef = useRef<AbortController | null>(null);
	const previousKeywordRef = useRef<TSearchCriteria>('');

	const resetSearch = useCallback(() => {
		setResult(null);
		setKeyword('');
		setPage(1);
		setIsLoading(false);
		previousKeywordRef.current = '';
	}, []);

	const appendResults = useCallback((newData: PaginatedResult<IProduct[]>) => {
		setResult((prev) => {
			if (!prev) return newData;

			return {
				...newData,
				data: [...prev.data, ...newData.data],
			};
		});
	}, []);

	useEffect(() => {
		abortControllerRef.current?.abort();

		if (isEmpty(keyword)) {
			resetSearch();
			return;
		}

		const controller = new AbortController();
		abortControllerRef.current = controller;

		const searchProducts = async () => {
			try {
				setIsLoading(true);
				const searchResult = await fetchSearchResults(keyword, page, limit, controller.signal);
				const isNewSearch = previousKeywordRef.current !== keyword;

				if (controller.signal.aborted) return;
				if (isNewSearch) {
					setResult(searchResult);
					setPage(1);
				} else {
					appendResults(searchResult);
				}

				previousKeywordRef.current = keyword;
			} catch (error) {
				if (controller.signal.aborted) return;
				loggerService.error('GlobalSearchContextProvider', 'Search failed', error);
				setResult(null);
			} finally {
				if (!controller.signal.aborted) {
					setIsLoading(false);
				}
			}
		};

		searchProducts();

		return () => {
			controller.abort();
		};
	}, [keyword, page, limit, resetSearch, appendResults]);

	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const contextValue = useMemo(
		() => ({
			keyword,
			setKeyword,
			page,
			setPage,
			limit,
			setLimit,
			result,
			isLoading,
			resetSearch,
		}),
		[keyword, page, limit, result, isLoading, resetSearch]
	);

	return <GlobalSearchContext.Provider value={contextValue}>{children}</GlobalSearchContext.Provider>;
};

export default GlobalSearchContextProvider;
