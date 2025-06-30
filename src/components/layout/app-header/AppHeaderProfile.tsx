'use client';

import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import styles from './AppHeader.module.scss';
import { faChevronRight, faDoorOpen, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import Spinner from '@/components/ui/spinner/Spinner';
import { useState, memo, useEffect, useCallback } from 'react';
import { ROUTES } from '@/consts/routes.setting';

const ProfileDropdownActions = memo(function ProfileDropdownActions({ onRedirecting }: { onRedirecting: () => void }) {
	const { user, isAuthenticated, logout } = useAuthContext();
	const isAdmin = isAuthenticated && user?.roles?.includes('admin');
	const actions = isAuthenticated
		? [
				{
					type: 'link',
					href: ROUTES.profile.path,
					icon: faUser,
					label: 'Trang cá nhân',
				},
				{
					type: 'button',
					onClick: logout,
					icon: faDoorOpen,
					label: 'Đăng xuất',
				},
		  ]
		: [
				{
					type: 'link',
					href: ROUTES.signin.path,
					icon: faDoorOpen,
					label: 'Đăng nhập',
					onClick: onRedirecting,
				},
				{
					type: 'link',
					href: ROUTES.signup.path,
					icon: faDoorOpen,
					label: 'Đăng ký',
					onClick: onRedirecting,
				},
		  ];
	return (
		<ul className={styles['app-header__profile-dropdown-actions']}>
			{isAdmin && (
				<li className={styles['app-header__profile-dropdown-actions__item']}>
					<Link href={ROUTES.admin.path} className={styles['app-header__profile-dropdown-actions__link']}>
						<div className={styles['app-header__profile-dropdown-actions__icon']}>
							<FontAwesomeIcon icon={faUserShield} />
						</div>
						<span className={styles['app-header__profile-dropdown-actions__label']}>Trang quản trị</span>
						<div className={styles['app-header__profile-dropdown-actions__arrow']}>
							<FontAwesomeIcon icon={faChevronRight} />
						</div>
					</Link>
				</li>
			)}
			{actions.map((action, idx) => (
				<li key={idx} className={styles['app-header__profile-dropdown-actions__item']}>
					{action.type === 'link' ? (
						<Link href={action.href || '#'} className={styles['app-header__profile-dropdown-actions__link']} onClick={action.onClick}>
							<div className={styles['app-header__profile-dropdown-actions__icon']}>
								<FontAwesomeIcon icon={action.icon} />
							</div>
							<span className={styles['app-header__profile-dropdown-actions__label']}>{action.label}</span>
							<div className={styles['app-header__profile-dropdown-actions__arrow']}>
								<FontAwesomeIcon icon={faChevronRight} />
							</div>
						</Link>
					) : (
						<button
							className={styles['app-header__profile-dropdown-actions__link']}
							onClick={() => {
								action.onClick?.();
							}}
						>
							<div className={styles['app-header__profile-dropdown-actions__icon']}>
								<FontAwesomeIcon icon={action.icon} />
							</div>
							<span className={styles['app-header__profile-dropdown-actions__label']}>{action.label}</span>
							<div className={styles['app-header__profile-dropdown-actions__arrow']}>
								<FontAwesomeIcon icon={faChevronRight} />
							</div>
						</button>
					)}
				</li>
			))}
		</ul>
	);
});

export default function AppHeaderProfile() {
	const [redirectLoading, setRedirectLoading] = useState<boolean>(false);
	const { user, isAuthenticated, logout, isLoading } = useAuthContext();
	const [dropdownState, setDropdownState] = useState<{
		isOpen: boolean;
	}>({
		isOpen: false,
	});

	const handleRedirectLoading = useCallback(() => {
		setRedirectLoading(true);
	}, []);

	const toggleDropdown = () => {
		setDropdownState((prev) => ({ isOpen: !prev.isOpen }));
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(`.${styles['app-header__profile-dropdown']}`) && dropdownState.isOpen) {
				setDropdownState({ isOpen: false });
			}
		};

		document.addEventListener('click', handleClickOutside);
		document.addEventListener('touchstart', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('touchstart', handleClickOutside);
		};
	});

	return (
		<>
			<div
				aria-label={isAuthenticated ? 'Profile' : 'Login'}
				className={`${styles['app-header__action']} ${styles['app-header__profile']} ${styles['app-header__action--clickable']}`}
				onClick={toggleDropdown}
				title={isAuthenticated ? 'Trang cá nhân' : 'Đăng nhập'}
			>
				{redirectLoading || isLoading ? <Spinner /> : <FontAwesomeIcon icon={faUser} />}
			</div>
			{dropdownState.isOpen && (
				<div className={`${styles['app-header__profile-dropdown']}`}>
					<div className={`${styles['app-header__profile-dropdown__user']}`}>
						<div className={`${styles['app-header__profile-dropdown__user__avatar']}`}>
							<img src={user?.avatar || '/imgs/undefined_user.png'} alt={user?.name || 'User Avatar'} />
						</div>
						<span className={`${styles['app-header__profile-dropdown__user__name']}`}>{user?.name || 'Khách'}</span>
					</div>
					<div className={`${styles['app-header__profile-dropdown__spread-line']}`}></div>
					<ProfileDropdownActions onRedirecting={handleRedirectLoading} />
				</div>
			)}
		</>
	);
}
