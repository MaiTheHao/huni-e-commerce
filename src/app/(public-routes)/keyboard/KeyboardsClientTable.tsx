'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ProductCartProps } from '@/components/product/product-card/ProductCard';
import ProductList from '@/components/product/product-list/ProductList';
import ProductListSkeleton from '@/components/product/product-list/ProductListSkeleton';
import { IPagination, ISearchFilterKeyboardRequest, ISearchFilterKeyboardsResponse, TKeyboardSortCriteria } from '@/interfaces';
import { convertProductsToCards } from '@/util/convert';
import { loggerService } from '@/services/logger.service';
import useSearchFilterCriteriaContext from '@/contexts/SearchFilterCriteriaContext/useSearchFilterCriteriaContext';
import AppSortFilter from '@/components/navigation/app-sort-filter/AppSortFilter';
import { IProductFilter } from '@/interfaces';
import PaginationBar from '@/components/navigation/pagination-bar/PaginationBar';

type KeyboardsClientTableProps = {
	initialKeyboards: ProductCartProps[];
	initialPagination: IPagination;
	initialFilter: IProductFilter;
};

async function fetchKeyboardsApi(page: number, limit: number, filterCriteria: ISearchFilterKeyboardRequest['criteria'], sortCriteria: TKeyboardSortCriteria, signal: AbortSignal) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/keyboard/search-filter`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			page,
			limit,
			keyword: '',
			criteria: filterCriteria,
			sort: sortCriteria,
		} as ISearchFilterKeyboardRequest),
		signal,
		cache: 'no-store',
	});
	return response;
}

function KeyboardsClientTable({ initialKeyboards, initialPagination, initialFilter }: KeyboardsClientTableProps) {
	const [keyboards, setKeyboards] = useState<ProductCartProps[]>(initialKeyboards);
	const [pagination, setPagination] = useState<IPagination>(initialPagination);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { filterCriteria, sortCriteria } = useSearchFilterCriteriaContext();
	const abortControllerRef = useRef<AbortController | null>(null);
	const isFirstRender = useRef<boolean>(true);

	// Hàm lấy danh sách bàn phím từ API dựa trên filter/sort/page
	const fetchKeyboards = useCallback(
		async (page: number, limit: number) => {
			// Hủy request trước nếu có
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			const abortController = new AbortController();
			abortControllerRef.current = abortController;
			setIsLoading(true);

			try {
				if (abortController.signal.aborted) return;
				const response = await fetchKeyboardsApi(page, limit, filterCriteria, sortCriteria, abortController.signal);

				if (abortController.signal.aborted) return;

				if (!response.ok) {
					loggerService.error('Lỗi khi lấy danh sách bàn phím: ', response.statusText);
					return;
				}

				const { data } = await response.json();
				const { keyboards, pagination } = data as ISearchFilterKeyboardsResponse;
				setKeyboards(convertProductsToCards(keyboards, 'keyboard'));
				setPagination(pagination);
			} catch (error: any) {
				// Nếu không phải lỗi do abort thì log lỗi
				if (error.name !== 'AbortError' && !abortController.signal.aborted) {
					loggerService.error('Lỗi khi lấy danh sách bàn phím:', error);
				}
			} finally {
				// Chỉ set loading khi request chưa bị abort
				if (!abortController.signal.aborted) {
					setIsLoading(false);
				}
			}
		},
		[filterCriteria, sortCriteria]
	);

	// Xử lý khi chuyển trang
	const handlePageChange = useCallback(
		(page: number) => {
			fetchKeyboards(page, pagination.limit);
		},
		[fetchKeyboards, pagination.limit]
	);

	// Lấy dữ liệu lần đầu nếu không có dữ liệu khởi tạo
	useEffect(() => {
		if (initialKeyboards.length === 0 || initialPagination.total === 0) {
			fetchKeyboards(1, initialPagination.limit);
		}
	}, []);

	// Lấy lại dữ liệu khi filter/sort thay đổi (bỏ qua lần render đầu)
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		fetchKeyboards(1, pagination.limit);
	}, [filterCriteria, sortCriteria]);

	return (
		<>
			{/* Bộ lọc và sắp xếp */}
			<AppSortFilter initialFilter={initialFilter} />
			{/* Hiển thị skeleton khi loading, ngược lại hiển thị danh sách sản phẩm */}
			{isLoading ? <ProductListSkeleton count={pagination.limit} /> : <ProductList products={keyboards} />}
			{/* Phân trang */}
			<PaginationBar
				page={pagination.page}
				limit={pagination.limit}
				total={pagination.total}
				totalPages={pagination.totalPages}
				onPageChange={handlePageChange}
				itemType='bàn phím'
				ariaLabel='Phân trang bàn phím'
			/>{' '}
		</>
	);
}

export default KeyboardsClientTable;
