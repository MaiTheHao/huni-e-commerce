import AuthContextProvider from '@/contexts/AuthContext/AuthContextProvider';
import styles from './NotificationLayout.module.scss';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthContextProvider>
			<main className={styles.NotificationLayout}>{children}</main>
		</AuthContextProvider>
	);
}
