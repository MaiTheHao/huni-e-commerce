'use client';
import React, { useCallback } from 'react';
import styles from '../Profile.module.scss';
import Swal from 'sweetalert2';
import api from '@/services/http-client/axios-interceptor';
import { loggerService } from '@/services/logger.service';
import { IResponse } from '@/interfaces';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { IUpdateDeliveryInfoRequestData } from '@/interfaces/api/user/update-delivery-info.interface';
import Spinner from '@/components/ui/spinner/Spinner';
import { IAddDeliveryAddressRequestData } from '@/interfaces/api/user/add-delivery-address.interface';
import { isEmpty } from '@/util';
import { HTTPStatus } from '@/enums/HttpStatus.enum';
import ShippingAddressAddForm from './ShippingAddressAddForm';
import ShippingAddressList from './ShippingAddressList';
import { useDeliveryInfoContext } from '@/contexts/DeliveryInfoContext/DeliveryInfoContextProvider';

interface Address {
	id: string;
	value: string;
	isPrimary: boolean;
}

const transformAddresses = (addresses: string[]): Address[] => {
	return addresses.map((address, index) => ({
		id: `addr_${index}`,
		value: address,
		isPrimary: index === 0,
	}));
};

export default function AddressesPage() {
	const { deliveryInfo, isGettingDeliveryInfo, refetchDeliveryInfo } = useDeliveryInfoContext();

	const addresses: Address[] = transformAddresses(deliveryInfo?.addresses || []);

	const validateForm = (value: string) => {
		if (!value) return 'Địa chỉ không được để trống';
		if (value.length < 10) return 'Địa chỉ phải có ít nhất 10 ký tự';
		if (value.length > 300) return 'Địa chỉ không được vượt quá 300 ký tự';
		return '';
	};

	const handleAddAddress = useCallback(
		async (newAddress: string): Promise<boolean> => {
			const errorMsg = validateForm(newAddress);
			if (errorMsg) {
				Swal.fire({
					icon: 'error',
					title: 'Lỗi!',
					text: errorMsg,
				});
				return false;
			}

			try {
				const addAddressRequestData: IAddDeliveryAddressRequestData = { address: newAddress };
				const response = await api.post('/user/delivery-info/address/add', addAddressRequestData);
				const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

				if (response.status !== HTTPStatus.OK) {
					throw new Error(responseData?.message || 'Không thể thêm địa chỉ giao hàng');
				}

				if (isEmpty(responseData.data)) throw new Error('Thông tin giao hàng không hợp lệ');

				await refetchDeliveryInfo();
				Swal.fire({
					icon: 'success',
					title: 'Thành công!',
					text: 'Thêm địa chỉ thành công',
				});
				return true;
			} catch (error: any) {
				Swal.fire({
					icon: 'error',
					title: 'Lỗi!',
					text: error.message,
				});
				return false;
			}
		},
		[refetchDeliveryInfo]
	);

	const handleSaveEdit = useCallback(
		async (newAddress: Address): Promise<boolean> => {
			const errorMsg = validateForm(newAddress.value);
			if (errorMsg) {
				Swal.fire({
					icon: 'error',
					title: 'Lỗi!',
					text: errorMsg,
				});
				return false;
			}

			const updateData: IUpdateDeliveryInfoRequestData = {
				addresses: addresses.map((addr) => (addr.id === newAddress.id ? newAddress.value : addr.value)),
			};

			try {
				const response = await api.post('/user/delivery-info/address/update', updateData);
				const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

				if (isEmpty(responseData.data)) {
					throw new Error('Thông tin giao hàng không hợp lệ');
				}

				if (response.status !== HTTPStatus.OK) {
					throw new Error(responseData?.message || 'Không thể cập nhật địa chỉ giao hàng');
				}

				await refetchDeliveryInfo();
				Swal.fire({
					icon: 'success',
					title: 'Thành công!',
					text: 'Cập nhật địa chỉ thành công',
				});
				return true;
			} catch (error: any) {
				Swal.fire({
					icon: 'error',
					title: 'Lỗi!',
					text: error.message,
				});
				return false;
			}
		},
		[addresses, refetchDeliveryInfo]
	);

	const handleDeleteAddress = useCallback(
		async (idx: number) => {
			try {
				const updateData: IUpdateDeliveryInfoRequestData = {
					addresses: addresses.reduce((acc: string[], addr, i) => {
						if (i !== idx) acc.push(addr.value);
						return acc;
					}, []),
				};

				const response = await api.post('/user/delivery-info/address/update', updateData);
				const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

				if (isEmpty(responseData.data)) {
					throw new Error('Không nhận được dữ liệu địa chỉ sau khi xóa');
				}

				if (response.status !== HTTPStatus.OK) {
					throw new Error(responseData?.message || 'Không thể xóa địa chỉ giao hàng');
				}

				await refetchDeliveryInfo();
				loggerService.info(`Đã xóa địa chỉ: ${addresses[idx]?.value}`);
				Swal.fire({
					icon: 'success',
					title: 'Thành công!',
					text: 'Xóa địa chỉ thành công',
				});
			} catch (error: any) {
				loggerService.error('Lỗi khi xóa địa chỉ:', error);
				Swal.fire({
					icon: 'error',
					title: 'Lỗi!',
					text: error.message || 'Không thể xóa địa chỉ',
				});
			}
		},
		[addresses, refetchDeliveryInfo]
	);

	const handleSetPrimaryAddress = useCallback(
		async (idx: number) => {
			try {
				const updateData: IUpdateDeliveryInfoRequestData = {
					addresses: addresses.reduce(
						(acc: string[], addr, i) => {
							if (i !== idx) acc.push(addr.value);
							return acc;
						},
						[addresses[idx].value]
					),
				};
				const response = await api.post('/user/delivery-info/address/update', updateData);
				const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

				if (isEmpty(responseData.data)) {
					throw new Error('Thông tin giao hàng không hợp lệ');
				}

				if (response.status !== HTTPStatus.OK) {
					throw new Error(responseData?.message || 'Không thể cập nhật địa chỉ giao hàng');
				}

				await refetchDeliveryInfo();
				Swal.fire({
					icon: 'success',
					title: 'Thành công!',
					text: 'Đặt địa chỉ mặc định thành công',
				});
			} catch (error: any) {
				Swal.fire({
					icon: 'error',
					title: 'Lỗi!',
					text: error.message,
				});
			}
		},
		[addresses, refetchDeliveryInfo]
	);

	return (
		<div className={styles.part}>
			<div className={styles.part__title}>Địa chỉ giao hàng</div>
			<div className={styles['shipping-address']}>
				<ShippingAddressAddForm onSubmit={handleAddAddress} />

				{isGettingDeliveryInfo ? (
					<p className={styles['part__loading-state']}>
						<Spinner /> Đang tải địa chỉ...
					</p>
				) : addresses.length > 0 ? (
					<ShippingAddressList addresses={addresses} onSave={handleSaveEdit} onSetPrimary={handleSetPrimaryAddress} onDelete={handleDeleteAddress} />
				) : (
					<p className={styles['part__empty-state']}>Chưa có địa chỉ giao hàng nào.</p>
				)}
			</div>
		</div>
	);
}
