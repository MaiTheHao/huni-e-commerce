import styles from './AuthLayout.module.scss';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <main className={styles.authLayout}>{children}</main>;
}
