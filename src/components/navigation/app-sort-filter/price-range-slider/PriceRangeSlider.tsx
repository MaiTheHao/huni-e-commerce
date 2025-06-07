'use client';
import React, { useState } from 'react';
import styles from './PriceRangeSlider.module.scss';
import { toLocalePrice } from '@/util/toLocalePrice.util';
import RangeSlider from '@/components/ui/range-slider/RangeSlider';

type PriceRangeSliderProps = {
	min: number;
	max: number;
	currentRange?: [number, number];
	step?: number;
	debounceTime?: number;
	onChange?: (range: [number, number]) => void;
};

function PriceRangeSlider({
	min = 0,
	max = 2000000,
	currentRange = [min, max],
	step = 100000,
	debounceTime = 0,
	onChange,
}: PriceRangeSliderProps) {
	const [priceRange, setPriceRange] = useState<[number, number]>(currentRange);
	const handleChange = (range: [number, number]) => {
		setPriceRange(range);
		if (onChange) {
			onChange(range);
		}
	};

	return (
		<div className={styles.priceRangeSlider}>
			<span className={styles.priceRangeSlider__label}>
				<span className={styles.priceRangeSlider__label__price}>{toLocalePrice(priceRange[0])}</span>
				{' - '}
				<span className={styles.priceRangeSlider__label__price}>{toLocalePrice(priceRange[1])}</span>
			</span>
			<RangeSlider
				min={min}
				max={max}
				step={step}
				currentRange={priceRange}
				onChange={handleChange}
				debounceTime={debounceTime}
			/>
		</div>
	);
}

export default PriceRangeSlider;
