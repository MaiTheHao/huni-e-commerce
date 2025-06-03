'use client';
import React from 'react';
import styles from './ProductCard.module.scss';

interface ProductCardInfoProps {
	name: string;
	price: number;
	discountPercent?: number;
}

const ProductCartInfo: React.FC<ProductCardInfoProps> = ({ name, price, discountPercent }) => {
	const discountedPrice = discountPercent ? price - (price * discountPercent) / 100 : price;

	const isDiscounted =
		!!discountPercent && discountPercent > 0 && discountPercent <= 100 && discountedPrice !== price;

	return (
		<div className={styles.productInfo}>
			<h3 className={styles.productName}>{name}</h3>
			<div className={styles.productDetails}>
				<div className={styles.productPrice}>
					{isDiscounted && (
						<span className={styles.originalPrice}>
							{price.toLocaleString('vi-VN', {
								style: 'currency',
								currency: 'VND',
							})}
						</span>
					)}
					<span className={styles.discountedPrice}>
						{discountedPrice.toLocaleString('vi-VN', {
							style: 'currency',
							currency: 'VND',
						})}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ProductCartInfo;
