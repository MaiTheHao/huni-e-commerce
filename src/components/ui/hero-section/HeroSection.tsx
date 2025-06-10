'use client';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './HeroSection.module.scss';
import { useMobileScrollX } from '@/hooks/useMobileScrollX';
import { IHeroSection } from '@/interfaces';
import HeroSectionContent from './HeroSectionContent';
import ThumbnailNavButton from '@/components/navigation/thumnail-nav-button/ThumbnailNavButton';
import clsx from 'clsx';

export type HeroSectionProps = {
	items: IHeroSection[];
};

function HeroSection({ items }: HeroSectionProps) {
	const [idx, setIdx] = useState(0);

	const memoizedProducts = useMemo(() => items.filter((p) => p.image).map((p, idx) => ({ ...p, _index: idx })), [items]);

	useEffect(() => {
		const timer = setInterval(() => {
			handleNext();
		}, 3000);

		return () => clearInterval(timer);
	}, [idx, memoizedProducts.length]);

	const handlePrev = () => {
		// if (isPrevDisabled) return;
		setIdx((prev) => (prev - 1 + memoizedProducts.length) % memoizedProducts.length);
	};

	const handleNext = () => {
		// if (isNextDisabled) return;
		setIdx((prev) => (prev + 1) % memoizedProducts.length);
	};

	const handleDotClick = (index: number) => {
		setIdx(index);
	};

	const { handleTouchStart, handleTouchMove, handleTouchEnd, direction, distance, reset } = useMobileScrollX();
	const handleTouchEndWithSwipe = (e: React.TouchEvent<HTMLDivElement>) => {
		handleTouchEnd(e);
		if (direction && Math.abs(distance) > 0) {
			if (direction === 'left') {
				handleNext();
			} else if (direction === 'right') {
				handlePrev();
			}
			reset();
		}
	};

	if (!memoizedProducts || memoizedProducts.length === 0) return null;

	return (
		<div className={clsx(styles.hero, 'mobile-not-border-radius')} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEndWithSwipe}>
			{/* Nội dung chính của Hero Section */}
			<HeroSectionContent items={memoizedProducts} idx={idx} />

			{/* Nút điều hướng và các điểm chỉ mục */}
			<ThumbnailNavButton
				onPrev={handlePrev}
				onNext={handleNext}
				// prevDisabled={isPrevDisabled}
				// nextDisabled={isNextDisabled}
				className={styles.nav}
			/>
			<div className={styles.dots}>
				{memoizedProducts.map((_, dotIdx) => (
					<button key={dotIdx} className={`${styles.dot} ${idx === dotIdx ? styles.active : ''}`} onClick={() => handleDotClick(dotIdx)} aria-label={`Chuyển đến sản phẩm ${dotIdx + 1}`} />
				))}
			</div>
		</div>
	);
}

export default HeroSection;
