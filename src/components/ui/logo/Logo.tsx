import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styles from './Logo.module.scss';

type Props = {
	className?: string;
	type?: 'dark' | 'light';
};

function Logo({ type = 'dark', className }: Props) {
	return (
		<Link href={'/home'} role='img' aria-label='logo' className={`${styles.logo} ${className}`}>
			<Image src={`/svgs/huni_icon--${type}.svg`} alt='logo' width={37} height={40} />
		</Link>
	);
}

export default Logo;
