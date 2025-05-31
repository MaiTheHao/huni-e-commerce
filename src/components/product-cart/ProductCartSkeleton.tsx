'use client';
import React from 'react';
import styles from './ProductCart.module.scss';
import skeletonStyles from './ProductCartSkeleton.module.scss';
import clsx from 'clsx';

function ProductCartSkeleton() {
	return (
		<article className={clsx(styles.productCart, skeletonStyles.skeleton)}>
			{/* Image skeleton */}
			<div className={clsx(styles.productImage, skeletonStyles.imageSkeleton)}>
				<div className={skeletonStyles.pulse}></div>
			</div>

			<div className={styles.productInfo}>
				{/* Name skeleton */}
				<div className={clsx(styles.productName, skeletonStyles.nameSkeleton)}>
					<div className={skeletonStyles.pulse}></div>
				</div>

				<div className={styles.productDetails}>
					{/* Price skeleton */}
					<div className={styles.productPrice}>
						<div className={clsx(skeletonStyles.originalPriceSkeleton, skeletonStyles.pulse)}></div>
						<div className={clsx(skeletonStyles.discountedPriceSkeleton, skeletonStyles.pulse)}></div>
					</div>

					{/* Actions skeleton */}
					<div className={styles.productActions}>
						<div
							className={clsx(
								styles.addToCartButton,
								skeletonStyles.actionSkeleton,
								skeletonStyles.pulse
							)}
						></div>
						<div
							className={clsx(styles.buyNowButton, skeletonStyles.actionSkeleton, skeletonStyles.pulse)}
						></div>
					</div>
				</div>
			</div>
		</article>
	);
}

export default ProductCartSkeleton;
