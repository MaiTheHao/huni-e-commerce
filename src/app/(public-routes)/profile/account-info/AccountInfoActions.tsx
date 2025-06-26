'use client';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import styles from '../Profile.module.scss';
import { ROUTES } from '@/consts/routes.setting';
import { faDoorOpen, faKey, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import Link from 'next/link';
import { memo } from 'react';

function AccountInfoActions() {
	const { logout } = useAuthContext();
	return (
		<div className={`${styles.part} ${styles['account-info-actions']}`}>
			<h2 className={styles.part__title}>Thao tác</h2>
			<ul className={styles['account-info-actions__list']}>
				<li>
					<Link href={'edit-profile'} className={styles['account-info-actions__list__item']}>
						<FontAwesomeIcon icon={faUserPen} />
						<span className={styles['account-info-actions__list__item__button']}>Chỉnh sửa</span>
					</Link>
				</li>
				<li>
					<Link href={ROUTES.resetPassword.path} className={styles['account-info-actions__list__item']}>
						<FontAwesomeIcon icon={faKey} />
						<span className={styles['account-info-actions__list__item__button']}>Đổi mật khẩu</span>
					</Link>
				</li>
				<li>
					<button onClick={() => logout()} className={`${styles['account-info-actions__list__item']} ${clsx(styles['account-info-actions__list__item--danger'])}`}>
						<FontAwesomeIcon icon={faDoorOpen} />
						<span className={styles['account-info-actions__list__item__button']}>Đăng xuất</span>
					</button>
				</li>
			</ul>
		</div>
	);
}

export default memo(AccountInfoActions);
