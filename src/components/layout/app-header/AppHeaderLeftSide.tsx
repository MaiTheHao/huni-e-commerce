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
		<div className={styles['app-header__left-side']}>
			{/* Hamburger Menu Icon */}
			<AppHeaderMenuModal navbarRoutes={navbarRoutes} />

			{/* Icon Section */}
			<Link href={'/home'} role='img' aria-label='logo' className={styles['app-header__logo']}>
				<Image src='/svgs/huni_icon.svg' alt='logo' width={37} height={40} />
			</Link>
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
