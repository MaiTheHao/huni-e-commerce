'use client';
import styles from '../Profile.module.scss';
import React, { FormEvent, memo, useCallback, useState } from 'react';
type ShippingAddressAddFormProps = {
	onSubmit: (value: string) => Promise<boolean>;
};

function ShippingAddressAddForm({ onSubmit }: ShippingAddressAddFormProps) {
	const [value, setValue] = useState<string>('');

	const handleSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			const status: boolean = await onSubmit?.(value.trim());
			if (status) {
				setValue('');
			}
		},
		[onSubmit, value]
	);

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	}, []);

	return (
		<form className={styles['shipping-address__add']} onSubmit={handleSubmit}>
			<input type='text' placeholder='Nhập địa chỉ giao hàng' className={styles['shipping-address__add__input']} onChange={handleChange} value={value} />
			<button type='submit' className={styles['shipping-address__add__button']}>
				Thêm mới
			</button>
		</form>
	);
}

export default memo(ShippingAddressAddForm);
