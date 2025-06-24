'use client';
import { faLocationDot, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './Profile.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import clsx from 'clsx';

const menuItems = [
	{
		href: '/profile/account-info',
		icon: faUser,
		label: 'Thông tin tài khoản',
	},
	{
		href: '/profile/shipping-address',
		icon: faLocationDot,
		label: 'Địa chỉ giao hàng',
	},
	{
		href: '/profile/orders',
		icon: faShoppingCart,
		label: 'Đơn hàng của tôi',
	},
];

export default function ProfileNavbar() {
	const path = usePathname();
	const isActive = useCallback((href: string) => path === href, [path]);
	return (
		<ul className={`${styles['left__actions']} ${styles['left-item']} ${styles.part}`}>
			{menuItems.map((item) => (
				<li key={item.href}>
					<Link href={item.href} className={clsx(styles['left__actions__btn'], { [styles['left__actions__btn--active']]: isActive(item.href) })}>
						<div className={styles['left__actions__btn__icon']}>
							<FontAwesomeIcon icon={item.icon} />
						</div>
						<span>{item.label}</span>
					</Link>
				</li>
			))}
		</ul>
	);
}
