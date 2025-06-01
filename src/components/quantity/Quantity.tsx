'use client';
import styles from './Quantity.module.scss';

export type QuantityProps = {
	value: number;
	onNext: () => void;
	onPrev: () => void;
	onInput?: (value: number) => void;
	nextDisabled?: boolean;
	prevDisabled?: boolean;
	className?: string;
};

function Quantity({ value, onNext, onPrev, onInput, nextDisabled, prevDisabled, className }: QuantityProps) {
	const handleNext = () => {
		if (nextDisabled) return;
		onNext();
	};

	const handlePrev = () => {
		if (prevDisabled) return;
		onPrev();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (onInput) {
			const inputValue = Number(e.target.value);
			if (!isNaN(inputValue)) {
				onInput(inputValue);
			}
		}
	};

	return (
		<div className={`${styles.quantity} ${className || ''}`}>
			<button className={styles.quantity__button} onClick={handlePrev} disabled={prevDisabled}>
				-
			</button>
			<input className={styles.quantity__value} value={value} onChange={handleInputChange} />
			<button className={styles.quantity__button} onClick={handleNext} disabled={nextDisabled}>
				+
			</button>
		</div>
	);
}

export default Quantity;
