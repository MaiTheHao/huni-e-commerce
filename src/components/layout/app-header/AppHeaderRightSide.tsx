'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AppHeader.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { useCartContext } from '@/contexts/CartContext/useCartContext';

export default function AppHeaderRightSide() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const { items } = useCartContext();
	const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen);
	};

	return (
		<div className={styles['app-header__right-side']}>
			{/* Search Bar Placeholder */}
			<div className={styles['app-header__search-wrapper']}>
				<div
					className={clsx(styles['app-header__search'], {
						[styles['app-header__search--expanded']]: isSearchOpen,
					})}
				>
					<input
						type='text'
						placeholder='Tìm kiếm...'
						className={clsx(styles['app-header__search-input'], {
							[styles['app-header__search-input--active']]: isSearchOpen,
						})}
					/>
					<button className={styles['app-header__search-btn']} aria-label='Search' onClick={toggleSearch}>
						<FontAwesomeIcon icon={faSearch} />
					</button>
				</div>
			</div>

			<Link href='/cart' aria-label='Shopping Cart' className={`${styles['app-header__action']} ${styles['app-header__action--clickable']}`}>
				<FontAwesomeIcon icon={faCartShopping} />
				{totalQuantity > 0 && <span className={styles['app-header__cart-badge']}>{totalQuantity}</span>}
			</Link>
			<Link href='/profile' aria-label='Profile' className={`${styles['app-header__action']} ${styles['app-header__action--clickable']}`}>
				<FontAwesomeIcon icon={faUser} />
			</Link>
		</div>
	);
}
