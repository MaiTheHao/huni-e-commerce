import AppBody from '@/components/layout/app-body/AppBody';
import styles from './Home.module.scss';
import React, { Suspense } from 'react';
import HomeItemsSection from './HomeItemsSection';
import HomeHeroSection from './HomeHeroSection';
import { getKeyboardWithPagination } from '@/server/actions';
import { heroSectionRepository } from '@/server/repositories/hero-section.repository';
import HeroSectionSkeleton from '@/components/ui/hero-section/HeroSectionSkeleton';

async function HomePage() {
	await heroSectionRepository.count();
	return (
		<AppBody>
			<Suspense fallback={<HeroSectionSkeleton />}>
				<HomeHeroSection />
			</Suspense>

			<section className={styles.content}>
				<HomeItemsSection title='Bàn phím cơ' subTitle='Chuyển trang ngay!' subHref='/keyboard' fetchWithPagination={getKeyboardWithPagination} productType='keyboard' />
			</section>
		</AppBody>
	);
}

export default HomePage;
