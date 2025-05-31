import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import styles from './AppHeader.module.scss';
import GlobalSearch from '../global-search/GlobalSearch';
import Link from 'next/link';
type Props = {};

export default function AppHeaderRightSide({}: Props) {
	return (
		<div className={`${styles.rightSide}`}>
			<GlobalSearch headerStyles={styles} isInner={true} />
			<Link href='/cart' aria-label='Shopping Cart' className={`${styles.link} ${styles.redirectable}`}>
				<FontAwesomeIcon icon={faCartShopping} />
			</Link>
			<Link href='/profile' aria-label='Profile' className={`${styles.link} ${styles.redirectable}`}>
				<FontAwesomeIcon icon={faUser} />
			</Link>
		</div>
	);
}
