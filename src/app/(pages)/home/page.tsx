import AppBody from '@/components/layout/app-body/AppBody';
import styles from './Home.module.scss';
import React, { Suspense } from 'react';
import HomeItemsSection from './HomeItemsSection';
import HomeHeroSection from './HomeHeroSection';
import { getKeyboardWithPagination } from '@/server/actions/keyboard/get-keyboards-with-pagination';
import { heroSectionRepository } from '@/server/repositories/hero-section.repository';
import HeroSectionSkeleton from '@/components/ui/hero-section/HeroSectionSkeleton';

type Props = {};

async function page({}: Props) {
	await heroSectionRepository.count();
	return (
		<AppBody>
			<Suspense fallback={<HeroSectionSkeleton />}>
				<HomeHeroSection />
			</Suspense>

			<section className={styles.content}>
				<HomeItemsSection
					title='Bàn phím cơ'
					subTitle='Chuyển trang ngay!'
					subHref='/keyboard'
					fetchWithPagination={getKeyboardWithPagination}
					productType='keyboard'
				/>
			</section>
		</AppBody>
	);
}

export default page;
