import React, { memo } from 'react';
import styles from './ProductList.module.scss';
import ProductCartSkeleton from '../product-cart/ProductCartSkeleton';

type Props = {
	count?: number;
};

function ProductListSkeleton({ count }: Props) {
	const skeletonCount = Number.isInteger(count) && count! > 0 ? count! : 4;
	const skeletonItems = Array.from({ length: skeletonCount }, (_, index) => (
		<li key={`product list skeleton-${index}`} className={styles.productListItem}>
			<ProductCartSkeleton />
		</li>
	));

	return <ul className={styles.productList}>{skeletonItems}</ul>;
}

export default memo(ProductListSkeleton);
