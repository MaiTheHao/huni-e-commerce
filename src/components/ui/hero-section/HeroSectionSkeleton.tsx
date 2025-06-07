import React from 'react';
import styles from './HeroSection.module.scss';
import skeletonStyles from './HeroSectionSkeleton.module.scss';
import clsx from 'clsx';

const skeletonArray = [0, 1, 2];

const HeroSectionSkeleton: React.FC = () => {
	return (
		<div className={clsx(styles.hero, skeletonStyles.skeleton)}>
			<div className={styles.bottom}>
				<div className={styles.content}>
					<div className={clsx(skeletonStyles.name)} />
					<div className={clsx(skeletonStyles.attrs)} />
					<div className={clsx(skeletonStyles.cta)} />
				</div>
				<div className={styles.dots}>
					{skeletonArray.map((idx) => (
						<div key={idx} className={clsx(styles.dot, skeletonStyles.dot)} />
					))}
				</div>
			</div>
		</div>
	);
};

export default HeroSectionSkeleton;
