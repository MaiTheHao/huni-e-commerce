import React from 'react';
import styles from './ThumbnailNavButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
type ThumbnailNavButtonProps = {
	onPrev?: () => void;
	onNext?: () => void;
	prevDisabled?: boolean;
	nextDisabled?: boolean;
	className?: string;
};

function ThumbnailNavButton({
	onPrev = () => {},
	onNext = () => {},
	prevDisabled = false,
	nextDisabled = false,
	className = '',
}: ThumbnailNavButtonProps) {
	const handlePrev = () => {
		if (!prevDisabled) {
			onPrev();
		}
	};
	const handleNext = () => {
		if (!nextDisabled) {
			onNext();
		}
	};

	return (
		<div className={clsx(styles.container, className)}>
			<button
				onClick={handlePrev}
				className={clsx(styles.prevButton, { [styles.disabled]: prevDisabled })}
				disabled={prevDisabled}
			>
				<FontAwesomeIcon icon={faAngleLeft} />
			</button>
			<button
				onClick={handleNext}
				className={clsx(styles.nextButton, { [styles.disabled]: nextDisabled })}
				disabled={nextDisabled}
			>
				<FontAwesomeIcon icon={faAngleRight} />
			</button>
		</div>
	);
}

export default ThumbnailNavButton;
