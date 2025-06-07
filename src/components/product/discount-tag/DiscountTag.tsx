import React from 'react';
import styles from './DiscountTag.module.scss';

type DiscountTagProps = {
	discountPercent?: number;
	className?: string;
};

function DiscountTag({ discountPercent, className }: DiscountTagProps) {
	if (discountPercent === undefined || discountPercent <= 0) {
		return null;
	}

	return <span className={`${styles.discountTag} ${className}`}>-{discountPercent}%</span>;
}

export default DiscountTag;
