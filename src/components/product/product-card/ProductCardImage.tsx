'use client';
import React, { ReactNode, useMemo } from 'react';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import DiscountTag from '../discount-tag/DiscountTag';

interface ProductCartImageProps {
	image?: string;
	name: string;
	price: number;
	discountPercent?: number;
	children?: ReactNode;
}

function ProductCartImage({ image, name, price, discountPercent, children }: ProductCartImageProps) {
	return (
		<section className={styles.productImage}>
			{image && (
				<Image
					src={image}
					alt={name}
					fill
					sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
					style={{ objectFit: 'cover' }}
					quality={100}
					priority={false}
				/>
			)}
			<DiscountTag discountPercent={discountPercent} />
			{children}
		</section>
	);
}

export default ProductCartImage;
