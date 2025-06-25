import React from 'react';
import { getKeyboardHeroSection } from '@/server/actions';
import { IHeroSection } from '@/interfaces';
import HeroSectionSkeleton from '@/components/ui/hero-section/HeroSectionSkeleton';
import HeroSection from '@/components/ui/hero-section/HeroSection';

async function HomeHeroSection() {
	let keyboardHeroSections: IHeroSection[] = [];
	try {
		keyboardHeroSections = await getKeyboardHeroSection(1, 4);
	} catch (error) {
		console.error('Lỗi khi lấy danh sách bàn phím cho HeroSection', error);
	}

	return keyboardHeroSections.length > 0 ? <HeroSection items={keyboardHeroSections} /> : <HeroSectionSkeleton />;
}

export default HomeHeroSection;
