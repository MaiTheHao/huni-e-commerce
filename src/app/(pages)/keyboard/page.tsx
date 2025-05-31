import AppBody from '@/components/app-body/AppBody';
import React, { Suspense } from 'react';
import KeyboardsHeroSection from './KeyboardsHeroSection';
import ShowItemsHeroSectionSkeleton from '@/components/hero-section/HeroSectionSkeleton';
import styles from './Keyboards.module.scss';
import KeyboardServerTable from './KeyboardServerTable';
import Loading from '../../../components/loading/Loading';

type Props = {};

async function page({}: Props) {
	return (
		<AppBody>
			<Suspense fallback={<ShowItemsHeroSectionSkeleton />}>
				<KeyboardsHeroSection />
			</Suspense>

			<section className={styles.KeyboardsTable}>
				<Suspense fallback={<Loading />}>
					<KeyboardServerTable />
				</Suspense>
			</section>
		</AppBody>
	);
}

export default page;
