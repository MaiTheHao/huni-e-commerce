'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AppHeader.module.scss';
import Link from 'next/link';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import GlobalSearchMini from '@/components/ui/global-search/mini/GlobalSearchMini';

export default function AppHeaderRightSide() {
	const { items } = useCartContext();
	const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
	return (
		<div className={styles['app-header__right-side']}>
			<GlobalSearchMini />
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
