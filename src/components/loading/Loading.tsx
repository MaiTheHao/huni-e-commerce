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

function Loading({}) {
	return (
		<div className={styles.loadingContainer}>
			<div className={styles.loadingContent}>
				<div className={styles.logoContainer}>
					<Image
						src={config.logo.src}
						alt={config.logo.alt}
						width={config.logo.width}
						height={config.logo.height}
						priority
						className={styles.logoImage}
					/>
				</div>

				<div className={styles.loadingBarWrapper}>
					<div className={styles.loadingBar} />
				</div>

				<div className={styles.loadingText}>
					{config.loadingText} <span className={styles.dots}>{config.dots}</span>
				</div>
			</div>
		</div>
	);
}

export default Loading;
