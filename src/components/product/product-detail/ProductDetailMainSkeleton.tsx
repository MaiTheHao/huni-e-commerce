'use client';
import styles from './ProductDetail.module.scss';
import skeletonStyles from './ProductDetailSkeleton.module.scss';
import clsx from 'clsx';
import Quantity from '../../ui/quantity/Quantity';

function ProductDetailMainContentSkeleton() {
	return (
		<>
			<div className={clsx(styles.info, skeletonStyles.info)}>
				<p className={clsx(styles.name, skeletonStyles.name, 'shimmer')}></p>
				<div className={clsx(styles.line, 'line')}></div>
				<div className={clsx(styles.price, skeletonStyles.price)}>
					<span
						className={clsx(
							styles.discountedPrice,
							skeletonStyles.discountedPrice,
							'shimmer--primary-color'
						)}
					></span>
				</div>
				<div className={styles.actions}>
					<Quantity value={1} onChange={() => {}} min={1} max={1} className={styles.actions__quantity} />
					<button className={clsx(styles.actions__buyNow, 'cta-button', 'disabled')} disabled>
						Mua ngay
					</button>
					<button className={clsx(styles.actions__addToCart, 'cta-button--outlined', 'disabled')} disabled>
						Thêm vào giỏ
					</button>
				</div>
			</div>
		</>
	);
}

export default ProductDetailMainContentSkeleton;
