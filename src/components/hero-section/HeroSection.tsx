'use client';
import React, { useState, useEffect, useMemo } from 'react';
import styles from './HeroSection.module.scss';
import { useMobileScrollX } from '@/hooks/useMobileScrollX';
import { IHeroSection } from '@/interfaces';
import HeroSectionContent from './HeroSectionContent';
import ThumbnailNavButton from '../thumnail-nav-button/ThumbnailNavButton';

export type HeroSectionProps = {
	items: IHeroSection[];
};

function HeroSection({ items }: HeroSectionProps) {
	const [current, setCurrent] = useState(0);

	const memoizedProducts = useMemo(
		() => items.filter((p) => p.image).map((p, idx) => ({ ...p, _index: idx })),
		[items]
	);

	// ! Tạm thời tắt do gặp vấn đề với scroll tự động, làm mất UX
	// useEffect(() => {
	// 	const timer = setInterval(() => {
	// 		handleNext();
	// 	}, 3000);

	// 	return () => clearInterval(timer);
	// }, [current, memoizedProducts.length]);

	const handlePrev = () => {
		setCurrent((prev) => (prev - 1 + memoizedProducts.length) % memoizedProducts.length);
	};

	const handleNext = () => {
		setCurrent((prev) => (prev + 1) % memoizedProducts.length);
	};

	const handleDotClick = (index: number) => {
		setCurrent(index);
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
		<div
			className={styles.hero}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEndWithSwipe}
		>
			{/* Nội dung chính của Hero Section */}
			<HeroSectionContent items={memoizedProducts} current={current} />

			{/* Nút điều hướng và các điểm chỉ mục */}
			<ThumbnailNavButton
				onPrev={handlePrev}
				onNext={handleNext}
				prevDisabled={current === 0}
				nextDisabled={current === memoizedProducts.length - 1}
				className={styles.nav}
			/>
			<div className={styles.dots}>
				{memoizedProducts.map((_, idx) => (
					<button
						key={idx}
						className={`${styles.dot} ${idx === current ? styles.active : ''}`}
						onClick={() => handleDotClick(idx)}
						aria-label={`Chuyển đến sản phẩm ${idx + 1}`}
					/>
				))}
			</div>
		</div>
	);
}

export default HeroSection;
