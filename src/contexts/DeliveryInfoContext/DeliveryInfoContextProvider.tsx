'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, memo } from 'react';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { fetchUserDeliveryInfo } from './apis';
import { loggerService } from '@/services/logger.service';
import useAuthContext from '../AuthContext/useAuthContext';

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
	const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();
	const [deliveryInfo, setDeliveryInfo] = useState<IGetDeliveryInfoResponseData | null>(null);
	const [isGettingDeliveryInfo, setIsGettingDeliveryInfo] = useState(false);
	const fetchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const refetchDeliveryInfo = useCallback(async () => {
		// Nếu không authenticated hoặc đang xác thực, không cần gọi API lấy thông tin giao hàng
		if (!isAuthenticated || isAuthLoading) {
			loggerService.warning('Không thể lấy thông tin giao hàng khi chưa đăng nhập hoặc đang xác thực');
			setDeliveryInfo(null);
			setIsGettingDeliveryInfo(false);
			return;
		}

		// Nếu đã có timeout đang chạy, hủy nó
		if (fetchTimeoutRef.current) {
			clearTimeout(fetchTimeoutRef.current);
		}

		// Thiết lập timeout để tránh gọi API quá thường xuyên
		fetchTimeoutRef.current = setTimeout(async () => {
			setIsGettingDeliveryInfo(true);
			try {
				const [error, data] = await fetchUserDeliveryInfo();
				if (error) {
					loggerService.error('Lấy thông tin giao hàng thất bại:', error);
					setDeliveryInfo(null);
				} else {
					loggerService.success('Lấy thông tin giao hàng thành công');
					setDeliveryInfo(data);
				}
			} catch (error) {
				loggerService.error('Lấy thông tin giao hàng thất bại:', error);
				setDeliveryInfo(null);
			} finally {
				setIsGettingDeliveryInfo(false);
			}
		}, 1000);
	}, [isAuthenticated]);

	useEffect(() => {
		if (!isAuthLoading) refetchDeliveryInfo();

		return () => {
			if (fetchTimeoutRef.current) {
				clearTimeout(fetchTimeoutRef.current);
			}
		};
	}, [refetchDeliveryInfo, isAuthLoading]);

	const contextValue = useMemo(() => ({ deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo }), [deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo]);

	return <DeliveryInfoContext.Provider value={contextValue}>{children}</DeliveryInfoContext.Provider>;
}

export default memo(DeliveryInfoContextProvider);
