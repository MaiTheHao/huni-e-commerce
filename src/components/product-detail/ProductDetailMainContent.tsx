'use client';
import React, { memo, useState } from 'react';
import styles from './ProductDetail.module.scss';
import Image from 'next/image';
import clsx from 'clsx';
import { IProduct } from '@/interfaces';
import Quantity from '../quantity/Quantity';
import { extractType } from '@/util/cast-type.util';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import ModalAlert from '../modal-alert/ModalAlert';
import ProductDetailMainContentSkeleton from './ProductDetailMainSkeleton';
import { toLocalePrice } from '@/util/toLocalePrice.util';

const ATTR_ICON_URL = '/svgs/attr_icon.svg';

function renderProductAttributes<T extends IProduct>(product: T | null, attrs: { field: keyof T; label: string }[]) {
	return attrs.slice(0, Math.min(attrs.length, 10)).map((attr) => {
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
			displayValue = '...';
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
	});
}

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
	isLoading?: boolean;
	onChangeQuantity: (newQuantity: number) => void;
}

function ProductDetailMainContent<T extends IProduct>({
	product,
	attrs,
	price,
	discountedPrice,
	quantity,
	onChangeQuantity,
	minQuantity = 1,
	maxQuantity = 100,
	isLoading = false,
}: ProductDetailMainContentProps<T>) {
	const [cartStatus, setCartStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const { loading, handleAddToCart } = useCartContext();
	const isDiscounted = Boolean(
		product?.discountPercent &&
			product.discountPercent > 0 &&
			product.discountPercent <= 100 &&
			discountedPrice !== price
	);

	const handleContextAddToCart = async () => {
		if (!product) return;
		setCartStatus('loading');
		try {
			await handleAddToCart(product._id, quantity);
			setCartStatus('success');
		} catch (error) {
			setCartStatus('error');
		}
	};

	return (
		<>
			{isLoading ? (
				<ProductDetailMainContentSkeleton />
			) : (
				<div className={styles.info}>
					<p className={styles.name}>{(product as any)?.name}</p>
					<div className={clsx(styles.line, 'line')}></div>
					<div className={styles.price}>
						{isDiscounted && <span className={styles.originalPrice}>{toLocalePrice(price)}</span>}
						<span className={styles.discountedPrice}>{toLocalePrice(discountedPrice)}</span>
					</div>

					<ul className={styles.features}>{renderProductAttributes(product, attrs)}</ul>
					<div className={styles.actions}>
						<Quantity
							value={quantity}
							onChange={onChangeQuantity}
							min={minQuantity}
							max={maxQuantity}
							className={styles.actions__quantity}
							debounceTime={0}
						/>
						<button
							className={clsx(styles.actions__buyNow, 'cta-button', {
								disabled: quantity <= 0,
							})}
						>
							Mua ngay
						</button>
						<button
							className={clsx(styles.actions__addToCart, 'cta-button--outlined', {
								disabled: quantity <= 0 || loading,
							})}
							onClick={handleContextAddToCart}
						>
							Thêm vào giỏ
						</button>
					</div>
				</div>
			)}

			{cartStatus === 'success' && (
				<ModalAlert
					title='Thành công'
					message='Sản phẩm đã được thêm vào giỏ hàng.'
					onClose={() => setCartStatus('idle')}
					timeout={3000}
				/>
			)}
			{cartStatus === 'error' && (
				<ModalAlert
					title='Lỗi'
					message='Không thể thêm sản phẩm vào giỏ hàng.'
					onClose={() => setCartStatus('idle')}
					timeout={3000}
				/>
			)}
		</>
	);
}

export default memo(ProductDetailMainContent);
