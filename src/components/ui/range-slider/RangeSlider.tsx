'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './RangeSlider.module.scss';

type RangeSliderProps = {
	min: number;
	max: number;
	currentRange?: [number, number];
	step?: number;
	baseValue?: number;
	onChange?: (range: [number, number]) => void;
	debounceTime?: number;
	className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const calcPercent = (value: number, min: number, max: number) => ((value - min) / (max - min)) * 100;

const snapToStep = (value: number, min: number, step: number = 0) => {
	if (step <= 0) return value;
	return Math.round((value - min) / step) * step + min;
};

function RangeSlider({ min, max, step = 0, currentRange = [min, max], onChange, debounceTime = 250, className = '' }: RangeSliderProps) {
	const [range, setRange] = useState<[number, number]>(currentRange);
	const trackRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			onChange?.(range);
		}, debounceTime);
	}, [range[0], range[1]]);

	const handleThumb = (idx: 0 | 1, clientX: number) => {
		const track = trackRef.current;
		if (!track) return;
		const rect = track.getBoundingClientRect();
		const x = clamp(clientX - rect.left, 0, rect.width);
		const value = Math.round((x / rect.width) * (max - min) + min);
		setRange((prev) => {
			const newRange = [...prev];
			newRange[idx] = snapToStep(value, min, step);
			if (newRange[0] > newRange[1]) {
				newRange[idx] = idx === 0 ? newRange[1] : newRange[0];
			}
			return newRange as [number, number];
		});
	};

	const handleThumbMove = (idx: 0 | 1) => (e: React.MouseEvent | React.TouchEvent) => {
		e.preventDefault();

		const move = (ev: MouseEvent | TouchEvent) => {
			const clientX = ev instanceof MouseEvent ? ev.clientX : ev.touches[0].clientX;
			handleThumb(idx, clientX);
		};

		const up = () => {
			document.removeEventListener('mousemove', move);
			document.removeEventListener('mouseup', up);
			document.removeEventListener('touchmove', move);
			document.removeEventListener('touchend', up);
		};

		document.addEventListener('mousemove', move);
		document.addEventListener('mouseup', up);
		document.addEventListener('touchmove', move);
		document.addEventListener('touchend', up);
	};

	const percentMin = calcPercent(range[0], min, max);
	const percentMax = calcPercent(range[1], min, max);

	return (
		<div className={`${styles.rangeSlider} ${className}`}>
			<div className={styles.rangeSlider__track} ref={trackRef}>
				<div
					className={styles.rangeSlider__track__highlight}
					style={{
						left: `${percentMin}%`,
						width: `${percentMax - percentMin}%`,
					}}
				/>
				<div className={styles.rangeSlider__track__thumb} style={{ left: `${percentMin}%` }} tabIndex={0} onMouseDown={handleThumbMove(0)} onTouchStart={handleThumbMove(0)} />
				<div className={styles.rangeSlider__track__thumb} style={{ left: `${percentMax}%` }} tabIndex={0} onMouseDown={handleThumbMove(1)} onTouchStart={handleThumbMove(1)} />
			</div>
		</div>
	);
}

export default RangeSlider;
