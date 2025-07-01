'use client';
import React, { memo } from 'react';
import styles from './AdminSidebar.module.scss';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import { NAV_LIST } from './AdminSideBarSetup';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

function AdminSidebar() {
	const [isHide, setIsHide] = React.useState(false);
	const { user } = useAuthContext();
	const pathname = usePathname();
	const isActive = (path: string) => pathname.includes(path);

	const handleToggleSidebar = () => {
		setIsHide(!isHide);
	};

	return (
		<>
			{isHide && (
				<button type='button' className={styles['sidebar-expand']} aria-label='Mở rộng sidebar' onClick={handleToggleSidebar}>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			)}
			<div className={`${styles['sidebar']} ${isHide ? styles.hide : ''}`}>
				<div className={styles['sidebar-header']}>
					<div className={styles['sidebar-header-user']}>
						<img src={user?.avatar} alt={user?.name} className={styles['sidebar-header-user__avatar']} />
						<span className={styles['sidebar-header-user__name']}>{user?.name}</span>
					</div>
					<button type='button' className={styles['sidebar-header-collapse']} aria-label='Thu gọn sidebar' onClick={handleToggleSidebar}>
						<FontAwesomeIcon icon={faMinus} />
					</button>
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
		</>
	);
}

export default memo(AdminSidebar);
