'use client';
import styles from './AppHeader.module.scss';
import GlobalSearchMini from '@/components/ui/global-search/mini/GlobalSearchMini';
import AppHeaderProfile from './AppHeaderProfile';
import AppHeaderCart from './AppHeaderCart';

export default function AppHeaderRightSide() {
	return (
		<div className={styles['app-header__right-side']}>
			<GlobalSearchMini />
			<AppHeaderCart />
			<AppHeaderProfile />
		</div>
	);
}
