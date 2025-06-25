import DeliveryInfoContextProvider from './DeliveryInfoContextProvider';
import styles from './Profile.module.scss';
import ProfileNavbar from './ProfileNavbar';
import SummaryInfo from './SummaryInfo';

export const metadata = {
	title: 'Thông tin cá nhân',
	description: 'Quản lý thông tin cá nhân, địa chỉ giao hàng và đơn hàng của bạn.',
	keywords: ['thông tin cá nhân', 'địa chỉ giao hàng', 'đơn hàng', 'quản lý tài khoản'],
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={styles.container}>
			<section className={`${styles.left} ${styles.block}`}>
				<SummaryInfo />
				<ProfileNavbar />
			</section>

			<section className={`${styles.right} ${styles.block}`}>
				<DeliveryInfoContextProvider>{children}</DeliveryInfoContextProvider>
			</section>
		</div>
	);
}
