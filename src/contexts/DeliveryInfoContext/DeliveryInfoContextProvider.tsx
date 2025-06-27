'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, memo } from 'react';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { fetchUserDeliveryInfo } from './apis';
import { loggerService } from '@/services/logger.service';

type DeliveryInfoContextType = {
	deliveryInfo: IGetDeliveryInfoResponseData | null;
	isGettingDeliveryInfo: boolean;
	refetchDeliveryInfo: () => Promise<void>;
};

const DeliveryInfoContext = createContext<DeliveryInfoContextType>({
	deliveryInfo: null,
	isGettingDeliveryInfo: true,
	refetchDeliveryInfo: async () => {},
});

export const useDeliveryInfoContext = () => useContext(DeliveryInfoContext);

type Props = { children?: ReactNode };

function DeliveryInfoContextProvider({ children }: Props) {
	const [deliveryInfo, setDeliveryInfo] = useState<IGetDeliveryInfoResponseData | null>(null);
	const [isGettingDeliveryInfo, setIsGettingDeliveryInfo] = useState(true);

	const refetchDeliveryInfo = useCallback(async () => {
		setIsGettingDeliveryInfo(true);
		try {
			const [error, data] = await fetchUserDeliveryInfo();
			if (error) {
				loggerService.error('Lấy thông tin giao hàng thất bại:', error);
				setDeliveryInfo(null);
			} else {
				setDeliveryInfo(data);
			}
		} catch (error) {
			loggerService.error('Lấy thông tin giao hàng thất bại:', error);
			setDeliveryInfo(null);
		} finally {
			loggerService.info('Đã lấy thông tin giao hàng');
			setIsGettingDeliveryInfo(false);
		}
	}, []);

	useEffect(() => {
		refetchDeliveryInfo();
	}, []);

	const contextValue = useMemo(() => ({ deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo }), [deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo]);

	return <DeliveryInfoContext.Provider value={contextValue}>{children}</DeliveryInfoContext.Provider>;
}

export default memo(DeliveryInfoContextProvider);
