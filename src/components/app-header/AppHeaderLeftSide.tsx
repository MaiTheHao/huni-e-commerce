'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './AppHeader.module.scss';
import clsx from 'clsx';
import AppHeaderMenuModal from './AppHeaderMenuModal';
import { useNavbarRoutes } from '@/hooks/useNavbarRoutes';

type Props = {};

export default function AppHeaderLeftSide({}: Props) {
	const navbarRoutes = useNavbarRoutes();

	return (
		<div className={styles.leftSide}>
			{/* Hamburger Menu Icon */}
			<AppHeaderMenuModal navbarRoutes={navbarRoutes} />

			{/* Icon Section */}
			<div role='img' aria-label='logo' className={styles.logo}>
				<Image src='/svgs/huni_icon.svg' alt='logo' width={37} height={40} />
			</div>
			{/* Navigation Section */}
			<nav className={styles.navbar}>
				{navbarRoutes.map((route) => (
					<Link
						key={route.path}
						href={route.path}
						className={clsx(styles['navbar-item'], 'link-underline', {
							['link-underline--active']: route.isActive,
						})}
					>
						{route.title}
					</Link>
				))}
			</nav>
		</div>
	);
}
