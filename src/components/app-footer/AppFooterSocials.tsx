'use client';
import React from 'react';
import styles from './AppFooter.module.scss';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { socialLinks } from '@/consts/socials.setting';

type AppFooterSocialsProps = {
	className?: string;
	itemClassName?: string;
	iconClassName?: string;
};

const AppFooterSocials: React.FC<AppFooterSocialsProps> = ({ className, itemClassName, iconClassName }) => {
	return (
		<section className={clsx(styles.directionGroup, className)}>
			<ul className={styles.directionSocials}>
				{socialLinks.map((link) => (
					<li
						key={link.name}
						className={clsx(styles.directionSocialsItem, styles.directionItem, itemClassName)}
					>
						<Link
							href={link.href}
							target='_blank'
							rel='noopener noreferrer'
							aria-label={link.name}
							className={clsx('animated-tilt-scale', styles.directionSocial, iconClassName)}
						>
							<FontAwesomeIcon icon={link.icon} />
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
};

export default AppFooterSocials;
