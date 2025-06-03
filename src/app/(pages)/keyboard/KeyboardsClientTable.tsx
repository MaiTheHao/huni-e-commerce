'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ProductCartProps } from '@/components/product-card/ProductCard';
import ProductList from '@/components/product-list/ProductList';
import ProductListSkeleton from '@/components/product-list/ProductListSkeleton';
import KeyboardsPagination from './KeyboardsPagination';
import { IPagination, KeyboardFilterableField } from '@/interfaces';
import { productsToProductCarts } from '@/util/productToProductCart.util';
import { loggerService } from '@/services/logger.service';

type KeyboardsClientTableProps = {
	initialKeyboards: ProductCartProps[];
	initialPagination: IPagination;
};

function KeyboardsClientTable({ initialKeyboards, initialPagination }: KeyboardsClientTableProps) {
	const [keyboards, setKeyboards] = useState<ProductCartProps[]>(initialKeyboards);
	const [pagination, setPagination] = useState<IPagination>(initialPagination);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchKeyboards = useCallback(async (page: number, limit: number) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const abortController = new AbortController();
		abortControllerRef.current = abortController;
		setIsLoading(true);

		try {
			if (abortController.signal.aborted) return;

			// Gọi API để lấy danh sách bàn phím
			const body: {
				page: number;
				limit: number;
				keyword: string;
				criteria: Record<string, any>;
			} = {
				page,
				limit,
				keyword: '',
				criteria: {},
			};

			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/keyboard/search-filter`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
				signal: abortController.signal,
			});

			if (abortController.signal.aborted) return;

			if (!response || response.status !== 200) {
				loggerService.error('Lỗi khi lấy danh sách bàn phím:', response.statusText);
				return;
			}

			const data = await response.json();
			const { keyboards, pagination } = data.data;
			setKeyboards(productsToProductCarts(keyboards, 'keyboard'));
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
	}, []);

	const handlePageChange = useCallback(
		(page: number) => {
			fetchKeyboards(page, pagination.limit);
		},
		[fetchKeyboards, pagination.limit]
	);

	useEffect(() => {
		if (initialKeyboards.length === 0 || initialPagination.total === 0) {
			fetchKeyboards(1, initialPagination.limit);
		}
	}, []);

	return (
		<>
			{isLoading ? <ProductListSkeleton count={pagination.limit} /> : <ProductList products={keyboards} />}
			<KeyboardsPagination
				page={pagination.page}
				limit={pagination.limit}
				total={pagination.total}
				totalPages={pagination.totalPages}
				onPageChange={handlePageChange}
			/>
		</>
	);
}

export default KeyboardsClientTable;
