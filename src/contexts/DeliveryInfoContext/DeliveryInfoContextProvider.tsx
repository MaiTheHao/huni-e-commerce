'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, memo } from 'react';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { fetchUserDeliveryInfo } from './apis';

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

	const contextValue = useMemo(() => ({ deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo }), [deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo]);

	return <DeliveryInfoContext.Provider value={contextValue}>{children}</DeliveryInfoContext.Provider>;
}

export default memo(DeliveryInfoContextProvider);
