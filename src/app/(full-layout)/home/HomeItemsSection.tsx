import Link from 'next/link';
import styles from './Home.module.scss';
import React, { Suspense } from 'react';
import HomeItemsSectionList from './HomeItemsSectionList';
import ProductListSkeleton from '@/components/product/product-list/ProductListSkeleton';

export type HeroItemsSectionProps = {
	title: string;
	fetchWithPagination: (page: number, limit: number) => Promise<any>;
	subTitle?: string;
	subHref?: string;
	productType: string;
};

function HomeItemsSection({ title, subTitle, subHref, fetchWithPagination, productType }: HeroItemsSectionProps) {
	return (
		<section className={styles.itemsSection} aria-label={title}>
			<div className={styles.itemSectionHeader}>
				<h2 className={styles.itemSectionTitle}>{title}</h2>
				{subTitle && (
					<Link className={styles.itemSectionSubtitle} href={subHref || '#'}>
						{subTitle}
					</Link>
				)}
			</div>
			<Suspense fallback={<ProductListSkeleton />}>
				<HomeItemsSectionList fetchWithPagination={fetchWithPagination} productType={productType} />
			</Suspense>
		</section>
	);
}

export default HomeItemsSection;
