'use client';
import React from 'react';
import styles from './ProductDetail.module.scss';
import Image from 'next/image';
import clsx from 'clsx';
import { IProduct } from '@/interfaces';
import Quantity from '../quantity/Quantity';
import { extractType } from '@/util/cast-type.util';

const ATTR_ICON_URL = '/svgs/attr_icon.svg';

interface ProductDetailMainContentProps<T extends IProduct> {
	product: T | null;
	attrs: {
		field: keyof T;
		label: string;
	}[];
	price: number;
	discountedPrice: number;
	quantity: number;
	maxQuantity?: number;
	minQuantity?: number;
	onChangeQuantity: (newQuantity: number) => void;
	onNextQuantity: () => void;
	onPrevQuantity: () => void;
}

function ProductDetailMainContent<T extends IProduct>({
	product,
	attrs,
	price,
	discountedPrice,
	quantity,
	onChangeQuantity,
	onNextQuantity,
	onPrevQuantity,
	minQuantity = 1,
	maxQuantity = 100,
}: ProductDetailMainContentProps<T>) {
	return (
		<div className={styles.info}>
			<p className={styles.name}>{(product as any)?.name}</p>
			<div className={clsx(styles.line, 'line')}></div>
			<div className={styles.price}>
				<span className={styles.originalPrice}>
					{price?.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND',
					})}
				</span>
				<span className={styles.discountedPrice}>
					{discountedPrice?.toLocaleString('vi-VN', {
						style: 'currency',
						currency: 'VND',
					})}
				</span>
			</div>
			<ul className={styles.features}>
				{attrs.slice(0, Math.min(attrs.length, 10)).map((attr) => {
					const value = (product as any)?.[attr.field];
					const { isArray, isBoolean, isString } = extractType(value);

					let displayValue: string;
					if (isArray) {
						displayValue = Array.isArray(value) && value.length > 0 ? value.join(', ') : 'Không có';
					} else if (isBoolean) {
						displayValue = value ? 'Có' : 'Không';
					} else if (isString) {
						displayValue = value ? value : 'Không có';
					} else if (typeof value === 'number') {
						displayValue = value.toString();
					} else if (value === null || value === undefined) {
						displayValue = 'Không có';
					} else {
						displayValue = String(value);
					}

					return (
						<li key={String(attr.field)} className={styles.feature}>
							<span className={styles.feature__label}>
								<Image src={ATTR_ICON_URL} alt={attr.label} width={16} height={16} />
								<span>{attr.label}:</span>
							</span>
							<span className={styles.feature__value}>{displayValue}</span>
						</li>
					);
				})}
			</ul>
			<div className={styles.actions}>
				<Quantity
					value={quantity}
					onNext={onNextQuantity}
					onPrev={onPrevQuantity}
					onInput={onChangeQuantity}
					nextDisabled={quantity >= (maxQuantity ?? 100)}
					prevDisabled={quantity <= (minQuantity ?? 1)}
					className={styles.actions__quantity}
				/>
				<button
					className={clsx(styles.actions__buyNow, 'cta-button', { disabled: quantity <= (minQuantity ?? 1) })}
				>
					Mua ngay
				</button>
				<button
					className={clsx(styles.actions__addToCart, 'cta-button--outlined', {
						disabled: quantity <= (minQuantity ?? 1),
					})}
				>
					Thêm vào giỏ
				</button>
			</div>
		</div>
	);
}

export default ProductDetailMainContent;
