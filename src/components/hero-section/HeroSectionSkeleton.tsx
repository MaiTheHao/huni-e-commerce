import React from 'react';
import styles from './HeroSection.module.scss';
import skeletonStyles from './HeroSectionSkeleton.module.scss';
import clsx from 'clsx';

const skeletonArray = [0, 1, 2];

const HeroSectionSkeleton: React.FC = () => {
	return (
		<div className={clsx(styles.container, skeletonStyles.skeleton)}>
			<div className={styles.bottomSection}>
				<div className={styles.content}>
					<div className={skeletonStyles.name} />
					<div className={skeletonStyles.attrs} />
					<div className={skeletonStyles.cta} />
				</div>
				<div className={styles.progressBar}>
					{skeletonArray.map((idx) => (
						<div key={idx} className={skeletonStyles.dot} />
					))}
				</div>
			</div>
		</div>
	);
};

export default HeroSectionSkeleton;
