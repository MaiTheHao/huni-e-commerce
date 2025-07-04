import React, { useState } from 'react';
import { IOrder, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import styles from '../OrderDetail.module.scss';
import Link from 'next/link';
import LabelInput from '@/components/ui/label-input/LabelInput';
import { z } from 'zod';

interface CustomerInfoProps {
	order: IOrder;
	editMode?: boolean;
	editForm?: {
		customerName: string;
		customerEmail: string;
		customerPhone: string;
		customerAddress: string;
		additionalInfo: string;
		status: TOrderStatus;
	};
	setEditForm?: React.Dispatch<
		React.SetStateAction<{
			customerName: string;
			customerEmail: string;
			customerPhone: string;
			customerAddress: string;
			additionalInfo: string;
			status: TOrderStatus;
		}>
	>;
	customerInfoValidate: z.ZodObject<any>;
	validateCustomerInfoError: Record<string, string>;
	setValidateCustomerInfoError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ order, editMode = false, editForm, setEditForm, customerInfoValidate, validateCustomerInfoError, setValidateCustomerInfoError }) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		if (!setEditForm) return;

		const schema = customerInfoValidate.shape[name as keyof typeof customerInfoValidate.shape];

		if (schema) {
			const status = schema.safeParse(value);
			setValidateCustomerInfoError((prev) => ({
				...prev,
				[name]: status.success ? '' : status.error.errors[0].message,
			}));
		} else {
			setValidateCustomerInfoError((prev) => ({ ...prev, [name]: '' }));
		}

		setEditForm((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className={styles.section}>
			<div className={styles['section__title--with-action']}>
				<h2 className={styles['section__title--with-action-text']}>Thông tin khách hàng</h2>
				{!editMode && order.type !== 'anonymous' && (
					<Link href={`/admin/customers/${order.customerId}`} className={styles.link}>
						Xem người dùng &rarr;
					</Link>
				)}
			</div>

			<div className={`${styles.info__grid} ${editMode ? styles['info__grid--edit'] : ''}`}>
				{editMode && editForm ? (
					<>
						<LabelInput
							label='Tên khách hàng'
							name='customerName'
							type='text'
							required
							placeholder='Nhập tên khách hàng'
							value={editForm.customerName}
							onChange={handleInputChange}
							validateError={validateCustomerInfoError.customerName}
						/>

						<LabelInput
							label='Email'
							name='customerEmail'
							type='email'
							required
							placeholder='Nhập email'
							value={editForm.customerEmail}
							onChange={handleInputChange}
							validateError={validateCustomerInfoError.customerEmail}
						/>

						<LabelInput
							label='Điện thoại'
							name='customerPhone'
							type='text'
							required
							placeholder='Nhập số điện thoại'
							value={editForm.customerPhone}
							onChange={handleInputChange}
							validateError={validateCustomerInfoError.customerPhone}
						/>

						<LabelInput
							label='Địa chỉ'
							name='customerAddress'
							type='textarea'
							required
							placeholder='Nhập địa chỉ'
							value={editForm.customerAddress}
							onChange={handleInputChange}
							validateError={validateCustomerInfoError.customerAddress}
						/>

						<LabelInput
							label='Ghi chú'
							name='additionalInfo'
							type='textarea'
							placeholder='Nhập ghi chú (tùy chọn)'
							value={editForm.additionalInfo}
							onChange={handleInputChange}
							validateError={validateCustomerInfoError.additionalInfo}
						/>
					</>
				) : (
					<>
						<div className={styles.info__item}>
							<span className={styles.info__label}>Tên khách hàng</span>
							<span className={styles.info__value}>{order.customerName}</span>
						</div>
						<div className={styles.info__item}>
							<span className={styles.info__label}>Email</span>
							<span className={styles.info__value}>{order.customerEmail}</span>
						</div>
						<div className={styles.info__item}>
							<span className={styles.info__label}>Điện thoại</span>
							<span className={styles.info__value}>{order.customerPhone}</span>
						</div>
						<div className={styles.info__item}>
							<span className={styles.info__label}>Địa chỉ</span>
							<span className={styles.info__value}>{order.customerAddress}</span>
						</div>
						{order.additionalInfo && (
							<div className={styles.info__item}>
								<span className={styles.info__label}>Ghi chú</span>
								<span className={`${styles.info__value}`}>{order.additionalInfo}</span>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default CustomerInfo;
