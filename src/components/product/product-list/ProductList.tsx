import React, { memo } from 'react';
import styles from './ProductList.module.scss';
import ProductCard, { ProductCartProps } from '../product-card/ProductCard';
import clsx from 'clsx';

type Props = {
	products: ProductCartProps[];
};

function ProductList({ products }: Props) {
	if (!products || products.length === 0) return null;
	return (
		<ul className={clsx(styles.productList, 'not-fill-width-mobile')}>
			{products.map(
				(product) =>
					product._id && (
						<li key={product._id} className={styles.productListItem}>
							<ProductCard {...product} />
						</li>
					)
			)}
		</ul>
	);
}

export default memo(ProductList);
