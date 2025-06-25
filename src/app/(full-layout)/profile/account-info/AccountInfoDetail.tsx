'use client';
import styles from '../Profile.module.scss';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import Spinner from '@/components/ui/spinner/Spinner';
import { memo } from 'react';
import { useDeliveryInfo } from '../DeliveryInfoContextProvider';

const nullValue = 'Chưa có';

function AccountInfoDetail() {
	const { isAuthenticated } = useAuthContext();
	const { deliveryInfo, isGettingDeliveryInfo } = useDeliveryInfo();

	return (
		<div className={styles.part}>
			<h2 className={styles.part__title}>Thông tin tài khoản</h2>
			{isAuthenticated && deliveryInfo ? (
				<ul className={styles['account-info-detail']}>
					<li className={styles['account-info-detail__item']}>
						<span className={styles['account-info-detail__item__label']}>Tên:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.name || nullValue}</span>
					</li>
					<li className={styles['account-info-detail__item']}>
						<span className={styles['account-info-detail__item__label']}>Email:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.email || nullValue}</span>
					</li>
					<li className={`${styles['account-info-detail__item']} ${styles['no-border']}`}>
						<span className={styles['account-info-detail__item__label']}>Số điện thoại:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.phone || nullValue}</span>
					</li>
					<li className={`${styles['account-info-detail__item']} ${styles['no-border']}`}>
						<span className={styles['account-info-detail__item__label']}>Địa chỉ chính:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.addresses?.[0] || nullValue}</span>
					</li>
				</ul>
			) : isGettingDeliveryInfo ? (
				<p className={styles['part__loading-state']}>
					<Spinner /> Đang tải thông tin...
				</p>
			) : (
				<div className={styles['part__empty-state']}>Thông tin rỗng</div>
			)}
		</div>
	);
}

export default memo(AccountInfoDetail);
