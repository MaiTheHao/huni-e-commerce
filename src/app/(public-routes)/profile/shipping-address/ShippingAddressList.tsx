'use client';
import React, { memo, useCallback, useState } from 'react';
import styles from '../Profile.module.scss';

interface Address {
	id: string;
	value: string;
	isPrimary: boolean;
}

type ShippingAddressList = {
	addresses: Address[];
	onSetPrimary: (idx: number) => void;
	onSave: (address: Address) => Promise<boolean>;
	onDelete?: (idx: number) => void;
};

function ShippingAddressList({ addresses, onSetPrimary, onSave, onDelete }: ShippingAddressList) {
	const [value, setValue] = useState<Address | null>(null);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (value) {
				setValue({ ...value, value: e.target.value });
			}
		},
		[value]
	);

	const handleReset = useCallback(() => {
		setValue(null);
	}, []);

	const handleSetPrimary = useCallback(
		(idx: number) => {
			onSetPrimary?.(idx);
		},
		[onSetPrimary]
	);

	const handleSave = useCallback(async () => {
		if (value) {
			const result = await onSave?.(value);
			if (result) {
				setValue(null);
			}
		}
	}, [onSave, value]);

	const handleDelete = useCallback(
		(idx: number) => {
			onDelete?.(idx);
		},
		[onDelete]
	);

	return (
		<ul className={styles['shipping-address-list']}>
			{addresses.map((address, idx) => {
				const isEditting = (value && value.id === address.id) || false;
				return (
					<li key={address.id} className={styles['shipping-address-list__item']}>
						<div className={styles['shipping-address-list__item__info']}>
							{isEditting ? (
								<textarea className={styles['shipping-address-list__item__info__input']} value={value?.value || ''} onChange={handleChange} disabled={!isEditting} />
							) : (
								<p className={styles['shipping-address-list__item__info__text']}>{address.value}</p>
							)}
						</div>
						<div className={styles['shipping-address-list__item__actions']}>
							{isEditting ? (
								<>
									<button className={styles['shipping-address-list__item__actions__edit--save']} onClick={handleSave}>
										Lưu
									</button>
									<button className={styles['shipping-address-list__item__actions__edit--cancel']} onClick={handleReset}>
										Hủy
									</button>
								</>
							) : (
								<>
									<button
										className={`${styles['shipping-address-list__item__actions__set-primary']} ${address.isPrimary && styles['is-primary']}`}
										disabled={address.isPrimary}
										onClick={() => {
											if (address.isPrimary) return;
											handleSetPrimary(idx);
										}}
									>
										{address.isPrimary ? 'Địa chỉ mặc định' : 'Đặt mặc định'}
									</button>
									<button className={styles['shipping-address-list__item__actions__edit']} onClick={() => setValue(address)}>
										Sửa
									</button>
									<button className={styles['shipping-address-list__item__actions__delete']} onClick={() => handleDelete(idx)}>
										Xóa
									</button>
								</>
							)}
						</div>
					</li>
				);
			})}
		</ul>
	);
}

export default memo(ShippingAddressList);
