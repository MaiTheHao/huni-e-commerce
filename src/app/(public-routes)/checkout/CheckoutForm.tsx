'use client';
import React, { memo } from 'react';
import LabelInput from '@/components/ui/label-input/LabelInput';
import Table from '@/components/ui/table/Table';
import styles from './Checkout.module.scss';
import clsx from 'clsx';
import { useDeliveryInfoContext } from '@/contexts/DeliveryInfoContext/DeliveryInfoContextProvider';
import { useCartContext } from '@/contexts/CartContext/useCartContext';

interface FormData {
	name: string;
	email: string;
	phone: string;
	address: string;
	additionalInfo: string;
}

interface CheckoutFormProps {
	formData: FormData;
	validateError: Record<string, string>;
	onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = memo(({ formData, validateError, onInputChange }) => {
	const { isGettingDeliveryInfo } = useDeliveryInfoContext();
	const { loading: isCartLoading } = useCartContext();
	const loading = isGettingDeliveryInfo || isCartLoading;

	return (
		<Table
			sections={[
				{
					title: 'Thông tin khách hàng',
					children: (
						<section className={styles.form}>
							<LabelInput placeholder='Nhập họ tên của bạn' label='Tên của bạn' name='name' required value={formData.name} onChange={onInputChange} validateError={validateError.name} />
							<LabelInput
								placeholder='example@gmail.com'
								label='Email của bạn'
								name='email'
								type='email'
								required
								value={formData.email}
								onChange={onInputChange}
								validateError={validateError.email}
							/>
							<LabelInput
								placeholder='0987654321'
								label='Số điện thoại'
								name='phone'
								type='text'
								required
								value={formData.phone}
								onChange={onInputChange}
								validateError={validateError.phone}
							/>
							<LabelInput
								placeholder='Nhập địa chỉ giao hàng của bạn'
								label='Địa chỉ giao hàng'
								name='address'
								required
								value={formData.address || ''}
								onChange={onInputChange}
								validateError={validateError.address}
							/>
							<LabelInput placeholder='Ghi chú cho đơn hàng' label='Thông tin bổ sung' name='additionalInfo' type='textarea' value={formData.additionalInfo} onChange={onInputChange} />
						</section>
					),
				},
			]}
			loading={loading}
			className={clsx(styles.formTable, styles.table)}
		/>
	);
});

CheckoutForm.displayName = 'CheckoutForm';

export default CheckoutForm;
