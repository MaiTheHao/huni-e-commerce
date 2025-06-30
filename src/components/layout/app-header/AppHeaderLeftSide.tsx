'use client';
import Link from 'next/link';
import styles from './AppHeader.module.scss';
import clsx from 'clsx';
import AppHeaderMenuModal from './AppHeaderMenuModal';
import { useNavbarRoutes } from '@/hooks/useNavbarRoutes';
import Logo from '@/components/ui/logo/Logo';

export default function AppHeaderLeftSide() {
	const navbarRoutes = useNavbarRoutes();

	return (
		<div className={styles['app-header__left-side']}>
			{/* Hamburger Menu Icon */}
			<AppHeaderMenuModal navbarRoutes={navbarRoutes} />

			{/* Icon Section */}
			<Logo />
			{/* Navigation Section */}
			<nav className={styles['app-header__nav']}>
				{navbarRoutes.map((route) => (
					<Link
						key={route.path}
						href={route.path}
						className={clsx(styles['app-header__nav-item'], 'link-underline', {
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
