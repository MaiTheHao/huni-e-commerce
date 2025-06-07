'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Quantity.module.scss';

export type QuantityProps = {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	className?: string;
	debounceTime?: number;
};

function Quantity({ value, onChange, min = 1, max = Infinity, className = '', debounceTime = 300 }: QuantityProps) {
	const [curValue, setCurValue] = useState(value);
	const debounceRef = useRef<NodeJS.Timeout | null>(null);

	const debounceCallback = useCallback(
		(callback: () => void) => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
			debounceRef.current = setTimeout(() => {
				callback();
			}, debounceTime);
		},
		[debounceTime]
	);

	const handleNext = () => {
		if (curValue >= max) return;
		const nextValue = curValue + 1;
		setCurValue(nextValue);
		debounceCallback(() => onChange(nextValue));
	};

	const handlePrev = () => {
		if (curValue <= min) return;
		const prevValue = curValue - 1;
		setCurValue(prevValue);
		debounceCallback(() => onChange(prevValue));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = Number(e.target.value);

		let newValue = curValue;
		if (!isNaN(inputValue) && inputValue >= min && inputValue <= max) {
			newValue = inputValue;
		} else if (inputValue > max) {
			newValue = max;
		} else if (inputValue < min) {
			newValue = min;
		}
		setCurValue(newValue);
		debounceCallback(() => onChange(newValue));
	};

	useEffect(() => {
		setCurValue(value);
	}, [value]);

	return (
		<div className={`${styles.quantity} ${className}`}>
			<button
				className={styles.quantity__button}
				onClick={handlePrev}
				disabled={curValue <= min}
				aria-label='Giảm số lượng'
			>
				-
			</button>
			<input
				className={styles.quantity__value}
				value={curValue}
				onChange={handleInputChange}
				aria-label='Số lượng'
			/>
			<button
				className={styles.quantity__button}
				onClick={handleNext}
				disabled={curValue >= max}
				aria-label='Tăng số lượng'
			>
				+
			</button>
		</div>
	);
}

export default Quantity;
