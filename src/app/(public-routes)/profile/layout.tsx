'use client';
import styles from './Profile.module.scss';
import ProfileNavbar from './ProfileNavbar';
import SummaryInfo from './SummaryInfo';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={styles.container}>
			<section className={`${styles.left} ${styles.block}`}>
				<SummaryInfo />
				<ProfileNavbar />
			</section>

			<section className={`${styles.right} ${styles.block}`}>{children}</section>
		</div>
	);
}
