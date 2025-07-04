'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IPagination, ISearchFilterUserRequest, ISearchFilterUsersResponse, TUserSortCriteria, IUser } from '@/interfaces';
import { loggerService } from '@/services/logger.service';
import { fetchSearchFilterUsers } from './apis';
import AdminCustomerUIWrapper from './AdminCustomerUIWrapper';

const DEFAULT_PAGINATION: IPagination = { page: 1, limit: 15, total: 0, totalPages: 1 };

function AdminCustomerPage() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [pagination, setPagination] = useState<IPagination>(DEFAULT_PAGINATION);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [filterCriteria, setFilterCriteria] = useState<ISearchFilterUserRequest['criteria']>({});
	const [sortCriteria, setSortCriteria] = useState<TUserSortCriteria>({});
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const abortControllerRef = useRef<AbortController | null>(null);
	const isFirstRender = useRef<boolean>(true);

	const fetchUsers = useCallback(
		async (page: number, limit: number) => {
			if (abortControllerRef.current) abortControllerRef.current.abort();
			const abortController = new AbortController();
			abortControllerRef.current = abortController;
			setIsLoading(true);

			try {
				if (abortController.signal.aborted) return;
				const [error, data] = await fetchSearchFilterUsers(page, limit, filterCriteria, sortCriteria, searchKeyword, abortController.signal);

				if (abortController.signal.aborted) return;

				if (error) {
					loggerService.error('Lỗi khi lấy danh sách khách hàng: ', error);
					return;
				}

				const { users, pagination } = data as ISearchFilterUsersResponse;
				setUsers(users);
				setPagination(pagination);
			} catch (error: any) {
				if (error.name !== 'AbortError' && !abortController.signal.aborted) {
					loggerService.error('Lỗi khi lấy danh sách khách hàng:', error);
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
			fetchUsers(page, pagination.limit);
		},
		[fetchUsers, pagination.limit]
	);

	useEffect(() => {
		fetchUsers(1, pagination.limit);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			fetchUsers(1, pagination.limit);
		}, 350);
	}, [filterCriteria, sortCriteria, searchKeyword]);

	const handleRoleChange = (value: string | null) => {
		setFilterCriteria((prev) => ({
			...prev,
			roles: value ? [value] : undefined,
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

	const handleEmailVerifiedStatusChange = (value: string | null) => {
		setFilterCriteria((prev) => ({
			...prev,
			isEmailVerified: value ? value === 'true' : undefined,
		}));
	};

	const handleSearchChange = (keyword: string) => {
		setSearchKeyword(keyword || '');
	};

	const handleRefetch = () => {
		fetchUsers(1, pagination.limit);
	};

	return (
		<AdminCustomerUIWrapper
			users={users}
			pagination={pagination}
			isLoading={isLoading}
			filterCriteria={filterCriteria}
			sortCriteria={sortCriteria}
			searchKeyword={searchKeyword}
			onRefetch={handleRefetch}
			onRoleChange={handleRoleChange}
			onSortFieldChange={handleSortFieldChange}
			onEmailVerifiedStatusChange={handleEmailVerifiedStatusChange}
			onSearchChange={handleSearchChange}
			onPageChange={handlePageChange}
		/>
	);
}

export default AdminCustomerPage;
