'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AppHeader.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
type Props = {};

export default function AppHeaderRightSide({}: Props) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const { items } = useCartContext();
	const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

	const toggleSearch = () => {
		setIsSearchOpen(!isSearchOpen);
	};

	return (
		<div className={styles.header__right}>
			{/* Search Bar Placeholder */}
			<div className={styles['header__right__search-container']}>
				<div className={styles['header__right__search']}>
					<input
						type='text'
						placeholder='Tìm kiếm...'
						className={clsx(styles['header__right__search__input'], {
							[styles['header__right__search__input--active']]: isSearchOpen,
						})}
					/>
					<button
						className={styles['header__right__search__button']}
						aria-label='Search'
						onClick={toggleSearch}
					>
						<FontAwesomeIcon icon={faSearch} />
					</button>
				</div>
			</div>

			<Link
				href='/cart'
				aria-label='Shopping Cart'
				className={`${styles.header__link} ${styles.header__cart} ${styles['header__link--redirect']}`}
			>
				<FontAwesomeIcon icon={faCartShopping} />
				{totalQuantity > 0 && <span className={styles.header__cart__badge}>{totalQuantity}</span>}
			</Link>
			<Link
				href='/profile'
				aria-label='Profile'
				className={`${styles.header__link} ${styles.header__profile} ${styles['header__link--redirect']}`}
			>
				<FontAwesomeIcon icon={faUser} />
			</Link>
		</div>
	);
}
