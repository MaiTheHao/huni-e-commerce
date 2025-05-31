'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import styles from './HeroSection.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useMobileScrollX } from '@/hooks/useMobileScrollX';
import { IHeroSection } from '@/interfaces';
import HeroSectionItem from './HeroSectionItem';
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

	useEffect(() => {
		const timer = setInterval(() => {
			handleNext();
		}, 5000);

		return () => clearInterval(timer);
	}, [current, memoizedProducts.length]);

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
			className={styles.container}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEndWithSwipe}
		>
			<ul className={styles.slider}>
				{memoizedProducts.map((product, idx) => {
					const isActive = idx === current;
					return (
						<li
							key={product._index}
							className={`${styles.sliderItem} ${isActive ? styles.active : ''}`}
							ref={(el) => {
								if (isActive && el) {
									el.scrollIntoView({
										behavior: 'smooth',
										block: 'nearest',
										inline: 'center',
									});
								}
							}}
						>
							<HeroSectionItem
								image={product.image}
								name={product.name}
								attrs={product.attrs}
								cta={product.cta}
								ctaHref={product.ctaHref}
							/>
						</li>
					);
				})}
			</ul>

			<ThumbnailNavButton onPrev={handlePrev} onNext={handleNext} className={styles.thumbnailsNav} />

			<div className={styles.progressBar}>
				{memoizedProducts.map((_, idx) => (
					<button
						key={idx}
						className={`${styles.progressDot} ${idx === current ? styles.active : ''}`}
						onClick={() => handleDotClick(idx)}
						aria-label={`Chuyển đến sản phẩm ${idx + 1}`}
					/>
				))}
			</div>
		</div>
	);
}

export default HeroSection;
