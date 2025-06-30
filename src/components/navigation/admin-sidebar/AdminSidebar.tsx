'use client';
import React, { memo } from 'react';
import styles from './AdminSidebar.module.scss';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import { NAV_LIST } from './AdminSideBarSetup';

function AdminSidebar() {
	const { user } = useAuthContext();
	const pathname = usePathname();
	const isActive = (path: string) => pathname.includes(path);

	return (
		<div className={styles.sidebar}>
			<div className={styles['sidebar-header']}>
				<div className={styles['sidebar-header-user']}>
					<img src={user?.avatar} alt={user?.name} className={styles['sidebar-header-user__avatar']} />
					<span className={styles['sidebar-header-user__name']}>{user?.name}</span>
				</div>
			</div>
			<div className={styles['sidebar-body']}>
				<ul className={styles['sidebar-body-list']}>
					{NAV_LIST.map((nav) => (
						<li key={nav.title} className={styles['sidebar-body-list-item']}>
							<span className={styles['sidebar-body-list-item-title']}>{nav.title}</span>
							<ul className={styles['sidebar-body-list-item-sublist']}>
								{nav.items.map((item) => (
									<li key={item.path} className={`${styles['sidebar-body-list-item-sublist-item']} ${isActive(item.path) ? styles.active : ''}`}>
										<Link href={item.path}>
											<FontAwesomeIcon icon={item.icon} />
											<span>{item.title}</span>
										</Link>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default memo(AdminSidebar);
