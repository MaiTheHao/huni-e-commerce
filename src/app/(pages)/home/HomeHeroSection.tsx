import React from 'react';
import { getKeyboardHeroSection } from '@/server/actions/herosection/get-keyboard-herosection';
import HeroSection from '@/components/hero-section/HeroSection';

type Props = {};

async function HomeHeroSection({}: Props) {
	const keyboards = await getKeyboardHeroSection(1, 4);
	return <HeroSection items={keyboards} />;
}

export default HomeHeroSection;
