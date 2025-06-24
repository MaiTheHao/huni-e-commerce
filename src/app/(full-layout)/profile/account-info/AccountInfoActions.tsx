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
				<li className={styles['account-info-actions__list__item']}>
					<FontAwesomeIcon icon={faUserPen} />
					<Link className={styles['account-info-actions__list__item__button']} href={'edit-profile'}>
						Chỉnh sửa thông tin
					</Link>
				</li>
				<li className={styles['account-info-actions__list__item']}>
					<FontAwesomeIcon icon={faKey} />
					<Link className={styles['account-info-actions__list__item__button']} href={ROUTES.resetPassword.path}>
						Đổi mật khẩu
					</Link>
				</li>
				<li className={`${styles['account-info-actions__list__item']} ${clsx(styles['account-info-actions__list__item--danger'])}`}>
					<FontAwesomeIcon icon={faDoorOpen} />
					<button className={styles['account-info-actions__list__item__button']} onClick={() => logout()}>
						Đăng xuất
					</button>
				</li>
			</ul>
		</div>
	);
}

export default memo(AccountInfoActions);
