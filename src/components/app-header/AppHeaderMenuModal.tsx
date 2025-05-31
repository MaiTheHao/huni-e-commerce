'use client';
import React, { useState } from 'react';
import styles from './AppHeader.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import ModalSidebar from '../modal-sidebar/ModalSideBar';
import { AppRouteWithActive } from '@/interfaces/route.interface';

type Props = {
	navbarRoutes: AppRouteWithActive[];
};

function AppHeaderMenuModal({ navbarRoutes }: Props) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className={styles['navbar-menu']}>
			<button className={`${styles['navbar-menu-icon']} ${styles.redirectable}`} onClick={() => setIsOpen(true)}>
				<FontAwesomeIcon icon={faBars} />
			</button>
			{/* Modal */}
			<ModalSidebar
				title='Menu'
				isOpen={isOpen}
				setOpen={setIsOpen}
				closeIcon={<FontAwesomeIcon icon={faCircleXmark} />}
			>
				<nav className={styles['navbar-menu-list']}>
					{navbarRoutes.map((route) => (
						<Link
							key={route.path}
							href={route.path}
							className={`${styles['navbar-menu-item']} ${route.isActive ? styles.active : ''}`}
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
