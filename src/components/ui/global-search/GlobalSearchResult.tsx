'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './GlobalSearchResult.module.scss';
import { IProduct, PaginatedResult } from '@/interfaces';

interface GlobalSearchResultProps {
	isShowable: boolean;
	result: PaginatedResult<IProduct[]> | null;
	isMorePages: boolean;
	isLoading: boolean;
	setIsSearchOpen: (open: boolean) => void;
	resetSearch: () => void;
	handleShowMore: () => void;
	toLocalePrice: (price: number) => string;
	calcDiscountPrice: (price: number, discountPercent: number) => number;
	toNumber: (value: any) => number;
	Spinner: React.ComponentType<{ className?: string }>;
}

const GlobalSearchResult: React.FC<GlobalSearchResultProps> = ({
	isShowable,
	result,
	isMorePages,
	isLoading,
	setIsSearchOpen,
	resetSearch,
	handleShowMore,
	toLocalePrice,
	calcDiscountPrice,
	toNumber,
	Spinner,
}) => {
	if (!isShowable) return null;

	return (
		<div className={styles['gs-results']}>
			<ul className={styles['gs-results-list']}>
				{result?.data?.map((item) => (
					<Link
						href={`/${item.productType}/${item._id}`}
						key={item._id}
						className={clsx(styles['gs-results-item'])}
						onClick={() => {
							setIsSearchOpen(false);
							resetSearch();
						}}
					>
						<div className={styles['gs-results-item-img']}>
							<Image src={item?.images[0]} alt={item.name} fill sizes='(max-width: 768px) 100%, 50vw' />
						</div>
						<div className={styles['gs-results-item-info']}>
							<h3 className={styles['gs-results-item-title']}>{item.name}</h3>
							<p className={styles['gs-results-item-price']}>
								<span className={styles['gs-results-item-price--cur']}>{toLocalePrice(calcDiscountPrice(item.price, item.discountPercent))}</span>
								{toNumber(item.discountPercent) > 0 && <span className={styles['gs-results-item-price--old']}>{toLocalePrice(item.price)}</span>}
							</p>
						</div>
					</Link>
				))}
				{isMorePages && (
					<div className={styles['gs-results-more']}>
						<button className={styles['gs-results-more-btn']} onClick={handleShowMore}>
							{isLoading ? <Spinner className={styles.icon} /> : 'Xem thêm'}
						</button>
					</div>
				)}
			</ul>
		</div>
	);
};

export default GlobalSearchResult;
