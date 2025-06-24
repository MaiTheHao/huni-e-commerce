'use client';

import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import styles from './AppHeader.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useCartContext } from '@/contexts/CartContext/useCartContext';

export default function AppHeaderCart() {
	const { items } = useCartContext();
	const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
	return (
		<Link href='/cart' aria-label='Shopping Cart' className={`${styles['app-header__action']} ${styles['app-header__action--clickable']}`}>
			<FontAwesomeIcon icon={faCartShopping} />
			{totalQuantity > 0 && <span className={styles['app-header__cart-badge']}>{totalQuantity}</span>}
		</Link>
	);
}
