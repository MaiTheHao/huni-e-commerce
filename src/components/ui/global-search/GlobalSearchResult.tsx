'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './GlobalSearchResult.module.scss';
import { IProduct, PaginatedResult } from '@/interfaces';
import Spinner from '../spinner/Spinner';
import { calcDiscountedPrice, toLocalePrice, toNumber } from '@/util';

interface GlobalSearchResultProps {
	isShowable: boolean;
	result: PaginatedResult<IProduct[]> | null;
	isMorePages: boolean;
	isLoading: boolean;
	handleShowMore: () => void;
	className?: string;
}

const GlobalSearchResult: React.FC<GlobalSearchResultProps> = ({ isShowable, result, isMorePages, isLoading, handleShowMore, className = '' }) => {
	if (!isShowable) return null;

	return (
		<div className={clsx(styles['gs-results'], className)}>
			<ul className={styles['gs-results-list']}>
				{result?.data?.map((item) => (
					<Link href={`/${item.productType}/${item._id}`} key={item._id} className={clsx(styles['gs-results-item'])}>
						<div className={styles['gs-results-item-img']}>
							<Image src={item?.images[0]} alt={item.name} fill sizes='(max-width: 768px) 100%, 50vw' />
						</div>
						<div className={styles['gs-results-item-info']}>
							<h3 className={styles['gs-results-item-title']}>{item.name}</h3>
							<p className={styles['gs-results-item-price']}>
								<span className={styles['gs-results-item-price--cur']}>{toLocalePrice(calcDiscountedPrice(item.price, item.discountPercent))}</span>
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
