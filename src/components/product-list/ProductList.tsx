import React, { memo } from 'react';
import styles from './ProductList.module.scss';
import ProductCart, { ProductCartProps } from '../product-cart/ProductCart';

type Props = {
	products: ProductCartProps[];
};

function ProductList({ products }: Props) {
	if (!products || products.length === 0) return null;
	return (
		<ul className={styles.productList}>
			{products.map(
				(product) =>
					product._id && (
						<li key={product._id} className={styles.productListItem}>
							<ProductCart {...product} />
						</li>
					)
			)}
		</ul>
	);
}

export default memo(ProductList);
