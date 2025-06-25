import HeroSection from '@/components/ui/hero-section/HeroSection';
import { getKeyboardHeroSection } from '@/server/actions';
import React from 'react';

type Props = {};

async function KeyboardsHeroSection({}: Props) {
	const keyboards = await getKeyboardHeroSection(1, 4);
	return <HeroSection items={keyboards} />;
}

export default KeyboardsHeroSection;
