import React from 'react';
import { getKeyboardHeroSection } from '@/server/actions/herosection/get-keyboard-herosection';
import HeroSection from '@/components/hero-section/HeroSection';
import { IHeroSection, IKeyboard } from '@/interfaces';

type Props = {};

async function HomeHeroSection({}: Props) {
	let keyboardHeroSections: IHeroSection[] = [];
	try {
		keyboardHeroSections = await getKeyboardHeroSection(1, 4);
	} catch (error) {
		console.error('Lỗi khi lấy danh sách bàn phím cho HeroSection', error);
	}
	return <HeroSection items={keyboardHeroSections} />;
}

export default HomeHeroSection;
