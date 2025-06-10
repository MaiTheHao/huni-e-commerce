'use client';
import React, { useEffect, useReducer, useMemo, useCallback } from 'react';
import styles from './ProductDetail.module.scss';
import { calcDiscountPrice } from '@/util/price.util';
import { loggerService } from '@/services/logger.service';
import { IProduct } from '@/interfaces';
import ProductDetailMainVisual from './ProductDetailMainVisual';
import ProductDetailMainContent from './ProductDetailMainContent';
import { ProductDetailProps } from './ProductDetail';
type ProductDetailMainProps<T extends IProduct> = ProductDetailProps<T>;

interface State<T> {
	product: T | null;
	thumbnailIndex: number;
	discountedPrice: number;
	quantity: number;
	isFetching: boolean;
}

const initialState = {
	product: null,
	thumbnailIndex: 0,
	discountedPrice: 0,
	quantity: 1,
	isFetching: true,
};

function reducer<T>(state: State<T>, action: any): State<T> {
	switch (action.type) {
		case 'SET_PRODUCT':
			const product = action.payload;
			const discountedPrice = calcDiscountPrice((product as any).price, (product as any).discountPercent, true);
			return { ...state, product, discountedPrice };
		case 'SET_THUMBNAIL_INDEX':
			return { ...state, thumbnailIndex: action.payload };
		case 'SET_QUANTITY':
			return { ...state, quantity: action.payload };
		case 'SET_IS_FETCHING':
			return { ...state, isFetching: action.payload };
		default:
			return state;
	}
}

function ProductDetailMain<T extends IProduct>({ productId, attrs, fetchProductById }: ProductDetailMainProps<T>) {
	const [state, dispatch] = useReducer(reducer<T>, initialState as State<T>);
	const MIN_QUANTITY = 1;
	const MAX_QUANTITY = state.product?.stock || 100;

	const isDiscounted = useMemo(
		() =>
			Boolean(
				(state.product as any)?.discountPercent &&
					(state.product as any).discountPercent > 0 &&
					(state.product as any).discountPercent <= 100 &&
					state.discountedPrice !== (state.product as any)?.price
			),
		[state.product?._id, state.product?.discountPercent, state.discountedPrice]
	);

	const handleChangeThumbnail = useCallback(
		(index: number) => {
			dispatch({ type: 'SET_THUMBNAIL_INDEX', payload: index });
		},
		[state.thumbnailIndex, state.product]
	);

	const handlePrevThumbnail = useCallback(() => {
		const newIndex = (state.thumbnailIndex - 1 + ((state.product as any)?.images.length || 0)) % ((state.product as any)?.images.length || 1);
		handleChangeThumbnail(newIndex);
	}, [handleChangeThumbnail]);

	const handleNextThumbnail = useCallback(() => {
		const newIndex = (state.thumbnailIndex + 1) % ((state.product as any)?.images.length || 1);
		handleChangeThumbnail(newIndex);
	}, [handleChangeThumbnail]);

	const handleChangeQuantity = (newQuantity: number) => {
		if (newQuantity < MIN_QUANTITY) {
			newQuantity = MIN_QUANTITY;
		} else if (newQuantity > MAX_QUANTITY) {
			newQuantity = MAX_QUANTITY;
		}
		dispatch({ type: 'SET_QUANTITY', payload: newQuantity });
	};

	const isNextDisabled = useMemo(
		() => (state.product as any)?.images.length === 0 || state.thumbnailIndex >= ((state.product as any)?.images.length || 1) - 1,
		[(state.product as any)?.images.length, state.thumbnailIndex]
	);

	const isPrevDisabled = useMemo(() => (state.product as any)?.images.length === 0 || state.thumbnailIndex <= 0, [(state.product as any)?.images.length, state.thumbnailIndex]);

	const fetchProduct = async () => {
		if (!productId) {
			loggerService.error('Không có ID sản phẩm');
			return;
		}

		let data;
		try {
			data = await fetchProductById(productId);
			dispatch({ type: 'SET_PRODUCT', payload: data });
		} catch (e) {
			loggerService.error('Không thể lấy thông tin sản phẩm');
		} finally {
			dispatch({ type: 'SET_IS_FETCHING', payload: false });
		}
	};

	useEffect(() => {
		fetchProduct();
	}, [productId]);

	return (
		<>
			<section className={`${styles.detail} mobile-not-border-radius`}>
				<ProductDetailMainVisual
					images={(state.product as any)?.images || []}
					productName={(state.product as any)?.name || ''}
					discountPercent={(state.product as any)?.discountPercent}
					thumbnailIndex={state.thumbnailIndex}
					isDiscounted={isDiscounted}
					onChangeThumbnail={handleChangeThumbnail}
					onPrevThumbnail={handlePrevThumbnail}
					onNextThumbnail={handleNextThumbnail}
					isFetching={state.isFetching}
					isNextDisabled={isNextDisabled}
					isPrevDisabled={isPrevDisabled}
				/>
				<ProductDetailMainContent
					product={state.product}
					attrs={attrs as { field: keyof IProduct; label: string }[]}
					price={(state.product as any)?.price}
					discountedPrice={state.discountedPrice}
					quantity={state.quantity}
					onChangeQuantity={handleChangeQuantity}
					isLoading={state.isFetching}
					minQuantity={MIN_QUANTITY}
					maxQuantity={MAX_QUANTITY}
				/>
			</section>
		</>
	);
}

export default ProductDetailMain;
