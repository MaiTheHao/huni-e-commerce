import styles from './NotificationLayout.module.scss';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <main className={styles.NotificationLayout}>{children}</main>;
}
