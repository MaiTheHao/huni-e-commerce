'use client';
import React from 'react';
import Image from 'next/image';
import styles from './Loading.module.scss';

const config = {
	logo: {
		src: '/svgs/huni_text--dark.svg',
		alt: 'Huni Keyboards',
		width: 240,
		height: 82,
	},
	loadingText: 'Đang tải',
	dots: '...',
};

interface LoadingProps {
	loadingText?: string;
}

function Loading({ loadingText }: LoadingProps) {
	return (
		<div className={styles['loading__container']}>
			<div className={styles['loading__content']}>
				<div className={styles['loading__logo-container']}>
					<Image
						src={config.logo.src}
						alt={config.logo.alt}
						width={config.logo.width}
						height={config.logo.height}
						priority
						className={styles['loading__logo-image']}
					/>
				</div>

				<div className={styles['loading__bar-wrapper']}>
					<div className={styles['loading__bar']} />
				</div>

				<div className={styles['loading__text']}>
					{loadingText ?? config.loadingText} <span className={styles['loading__dots']}>{config.dots}</span>
				</div>
			</div>
		</div>
	);
}

export default Loading;
