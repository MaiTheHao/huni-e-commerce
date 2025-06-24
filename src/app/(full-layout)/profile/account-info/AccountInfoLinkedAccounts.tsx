import { memo } from 'react';
import styles from '../Profile.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import { IOAuthProvider } from '@/interfaces';

const OAUTH_PROVIDERS = [
	{
		name: 'Google',
		icon: '/svgs/google.svg',
		providerName: 'google',
		href: `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/start/google`,
	},
];

const isProviderLinkAvailable = (providerName: string, userProviders: IOAuthProvider[]): boolean => {
	return userProviders.some((provider) => provider.providerName.toLowerCase() === providerName.toLowerCase());
};

function AccountInfolinkedAccounts() {
	const { user } = useAuthContext();
	return (
		<div className={`${styles.part} ${styles['account-info-linked-accounts']}`}>
			<h2 className={styles.part__title}>Tài khoản liên kết</h2>
			<ul className={styles['account-info-linked-accounts__list']}>
				{OAUTH_PROVIDERS.map((provider) => {
					const isLinked = isProviderLinkAvailable(provider.providerName, user?.oauthProviders || []);
					return (
						<li key={provider.providerName} className={`${styles['account-info-linked-accounts__list__item']} ${isLinked && styles['linked']}`}>
							<div className={`${styles['account-info-linked-accounts__list__item__provider']}`}>
								<Image src={provider.icon} alt={provider.name} width={24} height={24} />
								<span>{provider.name}</span>
							</div>
							<a href={!isLinked ? provider.href : '#'} className={styles['account-info-linked-accounts__list__item__action']} target='_self' rel='noopener noreferrer'>
								<FontAwesomeIcon icon={faLink} /> <span>{isLinked ? 'Đã liên kết' : 'Liên kết'}</span>
							</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

export default memo(AccountInfolinkedAccounts);
