'use client';
import React from 'react';
import styles from './ProductDetail.module.scss';
import ProductDetailMain from './ProductDetailMain';
import { IProduct } from '@/interfaces';
import ProductDetailMoreInfo from './ProductDetailMoreInfo';

export type ProductDetailProps<T extends IProduct> = {
	productId: string;
	attrs: {
		field: keyof T;
		label: string;
	}[];
	fetchProductById: (id: string) => Promise<T>;
};

function ProductDetail<T extends IProduct>({
	productId,
	attrs = [{ field: 'brand', label: 'Thương hiệu' }],
	fetchProductById,
}: ProductDetailProps<T>) {
	return (
		<div className={styles.container}>
			<ProductDetailMain<T> productId={productId} attrs={attrs} fetchProductById={fetchProductById} />
			<ProductDetailMoreInfo productId={productId} />
		</div>
	);
}

export default ProductDetail;
