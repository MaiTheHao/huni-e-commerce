import AppBody from '@/components/layout/app-body/AppBody';
import React, { Suspense } from 'react';
import KeyboardsHeroSection from './KeyboardsHeroSection';
import styles from './Keyboards.module.scss';
import KeyboardServerTable from './KeyboardServerTable';
import Loading from '../../../components/ui/loading/Loading';
import SearchFilterCriteriaContextProvider from '@/contexts/SearchFilterCriteriaContext/SearchFilterCriteriaContextProvider';
import HeroSectionSkeleton from '@/components/ui/hero-section/HeroSectionSkeleton';

type Props = {};

async function page({}: Props) {
	return (
		<SearchFilterCriteriaContextProvider>
			<Suspense fallback={<HeroSectionSkeleton />}>
				<KeyboardsHeroSection />
			</Suspense>

			<section className={styles.KeyboardsTable}>
				<Suspense fallback={<Loading />}>
					<KeyboardServerTable />
				</Suspense>
			</section>
		</SearchFilterCriteriaContextProvider>
	);
}

export default page;
