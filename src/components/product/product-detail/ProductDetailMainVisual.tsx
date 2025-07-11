'use client';
import React, { memo } from 'react';
import styles from './ProductDetail.module.scss';
import Image from 'next/image';
import clsx from 'clsx';
import Loading from '../../ui/loading/Loading';
import Spinner from '../../ui/spinner/Spinner';
import DiscountTag from '../discount-tag/DiscountTag';
import ThumbnailNavButton from '@/components/navigation/thumnail-nav-button/ThumbnailNavButton';

interface ProductDetailMainVisualProps {
	images: string[];
	productName: string;
	discountPercent?: number;
	thumbnailIndex: number;
	isDiscounted: boolean;
	isFetching: boolean;
	onChangeThumbnail: (index: number) => void;
	onPrevThumbnail: () => void;
	onNextThumbnail: () => void;
	isNextDisabled: boolean;
	isPrevDisabled: boolean;
}

function ProductDetailMainVisual({
	images,
	productName,
	discountPercent,
	thumbnailIndex,
	isFetching,
	onChangeThumbnail,
	onPrevThumbnail,
	onNextThumbnail,
	isNextDisabled,
	isPrevDisabled,
}: ProductDetailMainVisualProps) {
	return (
		<div className={styles.imgs}>
			<div className={styles.mainWrap}>
				<ul className={styles.main}>
					{isFetching ? (
						<li className={clsx(styles.img)}>
							<Spinner className={styles.spinner} />
						</li>
					) : (
						images.map((image: string, index: number) => {
							const isActive = index === thumbnailIndex;
							return (
								<li
									key={`product-detail-main-image-${index}`}
									className={clsx(styles.img, { [styles.active]: isActive })}
									ref={(el) => {
										if (isActive && el) {
											el.scrollIntoView({
												behavior: 'smooth',
												block: 'nearest',
												inline: 'center',
											});
										}
									}}
								>
									<Image src={image} alt={productName || ''} fill sizes='(max-width: 768px) 100vw, 50vw' style={{ objectFit: 'cover' }} quality={100} priority={isActive} />
								</li>
							);
						})
					)}
				</ul>
				<DiscountTag discountPercent={discountPercent} />
				<ThumbnailNavButton className={styles.nav} onPrev={onPrevThumbnail} onNext={onNextThumbnail} nextDisabled={isNextDisabled} prevDisabled={isPrevDisabled} />
			</div>

			<div className={styles.thumbWrap}>
				<ul className={styles.thumbs}>
					{images.map((image: string, index: number) => {
						if (!image) return null;
						const isActive = index === thumbnailIndex;
						return (
							<li
								key={`product-detail-thumbnail-${index}`}
								className={clsx(styles.thumb, { [styles.active]: isActive })}
								onClick={() => onChangeThumbnail(index)}
								ref={(el) => {
									if (isActive && el) {
										el.scrollIntoView({
											behavior: 'smooth',
											block: 'nearest',
											inline: 'center',
										});
									}
								}}
							>
								<Image src={image} alt={`Thumbnail ${index + 1}`} fill sizes='(max-width: 768px) 100vw, 560px' style={{ objectFit: 'cover' }} quality={80} priority={isActive} />
							</li>
						);
					})}
				</ul>
				<ThumbnailNavButton className={styles.nav} onPrev={onPrevThumbnail} onNext={onNextThumbnail} nextDisabled={isNextDisabled} prevDisabled={isPrevDisabled} />
			</div>
		</div>
	);
}

export default memo(ProductDetailMainVisual);
