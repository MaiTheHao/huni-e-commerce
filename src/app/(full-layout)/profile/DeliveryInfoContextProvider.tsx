'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import api from '@/services/http-client/axios-interceptor';
import { loggerService } from '@/services/logger.service';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { IResponse } from '@/interfaces';

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

export const useDeliveryInfo = () => useContext(DeliveryInfoContext);

const fetchUserDeliveryInfo = async (): Promise<IGetDeliveryInfoResponseData | null> => {
	try {
		const response = await api.get('/user/delivery-info');
		const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

		if (response.status !== 200) {
			loggerService.error('Lỗi khi lấy thông tin giao hàng:', responseData?.error);
			return null;
		}

		return responseData.data ?? null;
	} catch (error) {
		loggerService.error('Lỗi khi lấy thông tin giao hàng:', error);
		return null;
	} finally {
		loggerService.info('Đã hoàn thành việc lấy thông tin giao hàng');
	}
};

type Props = { children?: ReactNode };

function DeliveryInfoContextProvider({ children }: Props) {
	const [deliveryInfo, setDeliveryInfo] = useState<IGetDeliveryInfoResponseData | null>(null);
	const [isGettingDeliveryInfo, setIsGettingDeliveryInfo] = useState(true);

	const refetchDeliveryInfo = useCallback(async () => {
		setIsGettingDeliveryInfo(true);
		const data = await fetchUserDeliveryInfo();
		setDeliveryInfo(data);
		setIsGettingDeliveryInfo(false);
	}, []);

	useEffect(() => {
		let isMounted = true;
		refetchDeliveryInfo().finally(() => {
			if (!isMounted) return;
		});
		return () => {
			isMounted = false;
		};
	}, [refetchDeliveryInfo]);

	return <DeliveryInfoContext.Provider value={{ deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo }}>{children}</DeliveryInfoContext.Provider>;
}

export default DeliveryInfoContextProvider;
