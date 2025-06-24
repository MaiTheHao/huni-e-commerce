'use client';
import styles from '../Profile.module.scss';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import Spinner from '@/components/ui/spinner/Spinner';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { memo, useEffect, useState } from 'react';
import api from '@/services/http-client/axios-interceptor';
import { loggerService } from '@/services/logger.service';
import { IResponse } from '@/interfaces';

const fetchUserDeliveryInfo = async (): Promise<IGetDeliveryInfoResponseData> => {
	try {
		const response = await api.get('/user/delivery-info');
		const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

		if (response.status !== 200) {
			loggerService.error('Lỗi khi lấy thông tin giao hàng:', responseData?.error);
			throw new Error(responseData?.message || 'Không thể lấy thông tin giao hàng');
		}

		return responseData.data as IGetDeliveryInfoResponseData;
	} catch (error) {
		loggerService.error('Lỗi khi lấy thông tin giao hàng:', error);
		throw new Error('Không thể lấy thông tin giao hàng');
	} finally {
		loggerService.info('Đã hoàn thành việc lấy thông tin giao hàng');
	}
};

function AccountInfoDetail() {
	const { isAuthenticated } = useAuthContext();
	const [isGettingDeliveryInfo, setIsGettingDeliveryInfo] = useState<boolean>(true);
	const [deliveryInfo, setDeliveryInfo] = useState<IGetDeliveryInfoResponseData | null>(null);

	useEffect(() => {
		fetchUserDeliveryInfo()
			.then((data) => {
				setDeliveryInfo(data);
			})
			.catch(console.error)
			.finally(() => {
				setIsGettingDeliveryInfo(false);
			});
	}, []);

	return (
		<div className={styles.part}>
			<h2 className={styles.part__title}>Thông tin tài khoản</h2>
			{isAuthenticated && deliveryInfo ? (
				<ul className={styles['account-info-detail']}>
					<li className={styles['account-info-detail__item']}>
						<span className={styles['account-info-detail__item__label']}>Tên:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.name || '. . .'}</span>
					</li>
					<li className={styles['account-info-detail__item']}>
						<span className={styles['account-info-detail__item__label']}>Email:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.email || '. . .'}</span>
					</li>
					<li className={styles['account-info-detail__item']}>
						<span className={styles['account-info-detail__item__label']}>Số điện thoại:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.phone || '. . .'}</span>
					</li>
					<li className={styles['account-info-detail__item']}>
						<span className={styles['account-info-detail__item__label']}>Địa chỉ mặc định:</span>
						<span className={styles['account-info-detail__item__value']}>{deliveryInfo.addresses?.[0] || '. . .'}</span>
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
