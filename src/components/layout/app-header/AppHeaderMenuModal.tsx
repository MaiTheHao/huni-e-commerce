'use client';
import React, { useState } from 'react';
import styles from './AppHeader.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ModalSidebar from '../../ui/modal-sidebar/ModalSideBar';
import { AppRouteWithActive } from '@/interfaces/route.interface';
import clsx from 'clsx';
import Image from 'next/image';

type Props = {
	navbarRoutes: AppRouteWithActive[];
};

function AppHeaderMenuModal({ navbarRoutes }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={styles['app-header__menu']}>
			<button className={styles['app-header__menu-btn']} onClick={() => setIsOpen(true)}>
				<FontAwesomeIcon icon={faBars} />
			</button>
			{/* Modal */}
			<ModalSidebar
				title={
					<Link href={'/home'} role='img' aria-label='logo' className={styles['app-header__menu-logo']}>
						<Image src='/svgs/huni_text.svg' alt='logo' fill />
					</Link>
				}
				isOpen={isOpen}
				setOpen={setIsOpen}
				closeIcon={<FontAwesomeIcon icon={faCircleXmark} />}
				contentClassName={styles['app-header__menu-modal']}
			>
				<nav className={styles['app-header__menu-list']}>
					{navbarRoutes.map((route) => (
						<Link
							key={route.path}
							href={route.path}
							className={clsx(styles['app-header__menu-item'], {
								[styles['app-header__menu-item--active']]: route.isActive,
							})}
							onClick={() => setIsOpen(false)}
						>
							{route.title}
						</Link>
					))}
				</nav>
			</ModalSidebar>
		</div>
	);
}

export default AppHeaderMenuModal;
