'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IPagination, ISearchFilterKeyboardRequest, ISearchFilterKeyboardsResponse, TKeyboardSortCriteria, IKeyboard } from '@/interfaces';
import { loggerService } from '@/services/logger.service';
import AdminKeyboardUIWrapper from './AdminKeyboardUIWrapper';
import { fetchSearchFilterKeyboards } from './apis';

const DEFAULT_PAGINATION: IPagination = { page: 1, limit: 15, total: 0, totalPages: 1 };

function AdminKeyboardPage() {
	const [keyboards, setKeyboards] = useState<IKeyboard[]>([]);
	const [pagination, setPagination] = useState<IPagination>(DEFAULT_PAGINATION);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [filterCriteria, setFilterCriteria] = useState<ISearchFilterKeyboardRequest['criteria']>({});
	const [sortCriteria, setSortCriteria] = useState<TKeyboardSortCriteria>({});
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const abortControllerRef = useRef<AbortController | null>(null);
	const isFirstRender = useRef<boolean>(true);

	const fetchKeyboards = useCallback(
		async (page: number, limit: number) => {
			if (abortControllerRef.current) abortControllerRef.current.abort();
			const abortController = new AbortController();
			abortControllerRef.current = abortController;
			setIsLoading(true);

			try {
				if (abortController.signal.aborted) return;
				const [error, data] = await fetchSearchFilterKeyboards(page, limit, filterCriteria, sortCriteria, searchKeyword, abortController.signal);

				if (abortController.signal.aborted) return;

				if (error) {
					loggerService.error('Lỗi khi lấy danh sách bàn phím: ', error);
					return;
				}

				const { keyboards, pagination } = data as ISearchFilterKeyboardsResponse;
				setKeyboards(keyboards);
				setPagination(pagination);
			} catch (error: any) {
				if (error.name !== 'AbortError' && !abortController.signal.aborted) {
					loggerService.error('Lỗi khi lấy danh sách bàn phím:', error);
				}
			} finally {
				if (!abortController.signal.aborted) {
					setIsLoading(false);
				}
			}
		},
		[filterCriteria, sortCriteria, searchKeyword]
	);

	const handlePageChange = useCallback(
		(page: number) => {
			fetchKeyboards(page, pagination.limit);
		},
		[fetchKeyboards, pagination.limit]
	);

	useEffect(() => {
		fetchKeyboards(1, pagination.limit);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			fetchKeyboards(1, pagination.limit);
		}, 350);
	}, [filterCriteria, sortCriteria, searchKeyword]);

	const handleLayoutChange = (value: string | null) => {
		setFilterCriteria((prev) => ({
			...prev,
			layout: value ? [value] : undefined,
		}));
	};

	const handleStatusChange = (value: string | null) => {
		setFilterCriteria((prev) => ({
			...prev,
			isActive: value ? value === 'true' : undefined,
		}));
	};

	const handleSortFieldChange = (value: string | null) => {
		const [field, order] = value ? value.split('--') : [];
		const isAsc = order === 'asc';

		if (value) {
			setSortCriteria({ [field]: { order: isAsc ? 1 : -1 } });
		} else {
			setSortCriteria({});
		}
	};

	const handleSearchChange = (keyword: string) => {
		setSearchKeyword(keyword || '');
	};

	const handleResetFilters = () => {
		setFilterCriteria({});
		setSortCriteria({});
		setSearchKeyword('');
		fetchKeyboards(1, pagination.limit);
	};

	return (
		<AdminKeyboardUIWrapper
			keyboards={keyboards}
			pagination={pagination}
			isLoading={isLoading}
			filterCriteria={filterCriteria}
			sortCriteria={sortCriteria}
			searchKeyword={searchKeyword}
			onLayoutChange={handleLayoutChange}
			onStatusChange={handleStatusChange}
			onSortFieldChange={handleSortFieldChange}
			onSearchChange={handleSearchChange}
			onResetFilters={handleResetFilters}
			onPageChange={handlePageChange}
		/>
	);
}

export default AdminKeyboardPage;
