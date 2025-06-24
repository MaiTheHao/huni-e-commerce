'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchAddresses();
	}, []);

	const fetchAddresses = async () => {
		try {
			const response = await api.get('/user/delivery-info');
			const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

			if (response.status !== 200) {
				throw new Error(responseData?.message || 'Không thể lấy thông tin giao hàng');
			}

			const data = responseData.data as IGetDeliveryInfoResponseData;
			const addressList = data.addresses || [];

			setAddresses(transformAddresses(addressList));
		} catch (error) {
			loggerService.error('Lỗi khi lấy thông tin địa chỉ:', error);
			Swal.fire({
				icon: 'error',
				title: 'Lỗi',
				text: 'Không thể lấy thông tin địa chỉ',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const validateForm = (value: string) => {
		if (!value) return 'Địa chỉ không được để trống';
		if (value.length < 10) return 'Địa chỉ phải có ít nhất 10 ký tự';
		if (value.length > 300) return 'Địa chỉ không được vượt quá 300 ký tự';
		return '';
	};

	// info Hàm xử lí thêm địa chỉ giao hàng
	const handleAddAddress = useCallback(async (newAddress: string): Promise<boolean> => {
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
			// Chuẩn bị dữ liệu để gửi lên API
			const addAddressRequestData: IAddDeliveryAddressRequestData = {
				address: newAddress,
			};

			// Gửi yêu cầu thêm địa chỉ mới
			const response = await api.post('/user/delivery-info/address/add', addAddressRequestData);
			const responseData: IResponse<IGetDeliveryInfoResponseData> = response.data;

			if (response.status !== HTTPStatus.OK) {
				throw new Error(responseData?.message || 'Không thể thêm địa chỉ giao hàng');
			}

			// Thông tin giao hàng mới
			const deliveryInfo = responseData.data;

			// Nếu thông tin rỗng
			if (isEmpty(deliveryInfo)) throw new Error('Thông tin giao hàng không hợp lệ');

			setAddresses(transformAddresses(deliveryInfo!.addresses || []));
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
	}, []);

	// info Logic xử lí chỉnh sửa địa chỉ giao hàng
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

				setAddresses(transformAddresses(responseData.data!.addresses || []));
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
		[addresses]
	);

	// info Hàm xử lí xóa địa chỉ giao hàng
	const handleDeleteAddress = useCallback(
		async (idx: number) => {
			try {
				const deletedAddress = addresses[idx];
				const updateData: IUpdateDeliveryInfoRequestData = {
					addresses: addresses.reduce((acc: string[], addr, i) => {
						if (i !== idx) {
							acc.push(addr.value);
						}
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

				setAddresses(transformAddresses(responseData.data!.addresses || []));
				loggerService.info(`Đã xóa địa chỉ: ${deletedAddress.value}`);
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
		[addresses]
	);

	// info Hàm xử lí đặt địa chỉ mặc định
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

				setAddresses(transformAddresses(responseData.data!.addresses || []));
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
		[addresses]
	);

	return (
		<>
			<div className={styles.part}>
				<div className={styles.part__title}>Địa chỉ giao hàng</div>
				<div className={styles['shipping-address']}>
					<ShippingAddressAddForm onSubmit={handleAddAddress} />

					{isLoading ? (
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
		</>
	);
}
