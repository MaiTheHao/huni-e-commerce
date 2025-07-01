'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IPagination, ISearchFilterOrderRequest, ISearchFilterOrdersResponse, TOrderSortCriteria, IOrder } from '@/interfaces';
import { loggerService } from '@/services/logger.service';
import AdminOrderUIWrapper from './AdminOrderUIWrapper';
import { fetchSearchFilterOrders } from './apis';

const DEFAULT_PAGINATION: IPagination = { page: 1, limit: 15, total: 0, totalPages: 1 };

function AdminOrderPage() {
	const [orders, setOrders] = useState<IOrder[]>([]);
	const [pagination, setPagination] = useState<IPagination>(DEFAULT_PAGINATION);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [filterCriteria, setFilterCriteria] = useState<ISearchFilterOrderRequest['criteria']>({});
	const [sortCriteria, setSortCriteria] = useState<TOrderSortCriteria>({});
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const abortControllerRef = useRef<AbortController | null>(null);
	const isFirstRender = useRef<boolean>(true);

	const fetchOrders = useCallback(
		async (page: number, limit: number) => {
			if (abortControllerRef.current) abortControllerRef.current.abort();
			const abortController = new AbortController();
			abortControllerRef.current = abortController;
			setIsLoading(true);

			try {
				if (abortController.signal.aborted) return;
				const [error, data] = await fetchSearchFilterOrders(page, limit, filterCriteria, sortCriteria, searchKeyword, abortController.signal);

				if (abortController.signal.aborted) return;

				if (error) {
					loggerService.error('Lỗi khi lấy danh sách đơn hàng: ', error);
					return;
				}

				const { orders, pagination } = data as ISearchFilterOrdersResponse;
				setOrders(orders);
				setPagination(pagination);
			} catch (error: any) {
				if (error.name !== 'AbortError' && !abortController.signal.aborted) {
					loggerService.error('Lỗi khi lấy danh sách đơn hàng:', error);
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
			fetchOrders(page, pagination.limit);
		},
		[fetchOrders, pagination.limit]
	);

	useEffect(() => {
		fetchOrders(1, pagination.limit);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			fetchOrders(1, pagination.limit);
		}, 350);
	}, [filterCriteria, sortCriteria, searchKeyword]);

	const handleStatusChange = (value: string | null) => {
		setFilterCriteria((prev) => ({
			...prev,
			status: value ? [value] : undefined,
		}));
	};
	const handlePaymentMethodChange = (value: string | null) => {
		setFilterCriteria((prev) => ({
			...prev,
			paymentMethod: value ? [value] : undefined,
		}));
	};
	const handleOrderTypeChange = (value: string | null) => {
		setFilterCriteria((prev) => ({
			...prev,
			type: value ? [value] : undefined,
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
		fetchOrders(1, pagination.limit);
	};

	return (
		<AdminOrderUIWrapper
			orders={orders}
			pagination={pagination}
			isLoading={isLoading}
			filterCriteria={filterCriteria}
			sortCriteria={sortCriteria}
			searchKeyword={searchKeyword}
			onStatusChange={handleStatusChange}
			onPaymentMethodChange={handlePaymentMethodChange}
			onOrderTypeChange={handleOrderTypeChange}
			onSortFieldChange={handleSortFieldChange}
			onSearchChange={handleSearchChange}
			onPageChange={handlePageChange}
		/>
	);
}

export default AdminOrderPage;
