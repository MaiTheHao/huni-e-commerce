'use client';
import styles from './Admin.module.scss';
import AdminSidebar from '@/components/navigation/admin-sidebar/AdminSidebar';
import AdminValidate from './admin/AdminValidate';
import AuthContextProvider from '@/contexts/AuthContext/AuthContextProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthContextProvider>
			<AdminValidate>
				<div className={`${styles.container} app-container`}>
					<div className={`${styles.block}`}>
						<AdminSidebar />
						<main className={styles.body}>{children}</main>
					</div>
				</div>
			</AdminValidate>
		</AuthContextProvider>
	);
}
