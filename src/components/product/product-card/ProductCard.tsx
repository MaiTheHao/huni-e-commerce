'use client';
import React, { useState, memo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import styles from './ProductCard.module.scss';
import useScreenSize, { BREAKPOINT_LG } from '@/hooks/useScreenSize';
import ModalBottom from '../../ui/modal-bottom/ModalBottom';
import { IProductCard } from '@/interfaces';
import ProductCartImage from './ProductCardImage';
import ProductCartInfo from './ProductCardInfo';
import Spinner from '../../ui/spinner/Spinner';
import ModalAlert from '../../ui/modal-alert/ModalAlert';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import { toString } from '@/util/convert';

export type ProductCartProps = {} & IProductCard;

function ProductCard({ _id, name, price, discountPercent, image, ctaHref }: ProductCartProps) {
	const { handleAddToCart } = useCartContext();
	const { width } = useScreenSize();
	const [isActive, setIsActive] = useState(false);
	const [isRedirectToDetail, setIsRedirectToDetail] = useState(false);
	const [cartStatus, setCartStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const isAbleToShowModal = width <= BREAKPOINT_LG;

	const handleContextAddToCart = async () => {
		try {
			setCartStatus('loading');
			await handleAddToCart(toString(_id));
			setCartStatus('success');
		} catch (error) {
			setCartStatus('error');
			console.error(error);
		}
	};

	return (
		<>
			<article
				data-product-id={_id}
				data-product-name={name}
				data-product-price={price}
				data-product-discount={discountPercent}
				onClick={() => setIsActive(true)}
				className={clsx(styles.productCart, {
					[styles.touched]: isAbleToShowModal && isActive,
				})}
			>
				<ProductCartImage image={image} name={name} price={price} discountPercent={discountPercent}>
					<div
						className={clsx(styles.productActions, {
							[styles.touched]: isActive && (isRedirectToDetail || cartStatus === 'loading'),
						})}
					>
						<button className={clsx(styles.addToCartButton, styles.productActionsButton)} onClick={handleContextAddToCart}>
							{cartStatus === 'loading' ? <Spinner /> : <FontAwesomeIcon icon={faCartShopping} />}
						</button>
						<Link href={ctaHref} className={clsx(styles.watchMoreButton, styles.productActionsButton)} onClick={() => setIsRedirectToDetail(true)}>
							{isRedirectToDetail ? <Spinner /> : <span>Xem chi tiết</span>}
						</Link>
					</div>
				</ProductCartImage>
				<ProductCartInfo name={name} price={price} discountPercent={discountPercent} />
			</article>

			{isAbleToShowModal && isActive && (
				<ModalBottom isOpen={isActive} onClose={() => setIsActive(false)}>
					<>
						<button className={styles.addToCartButtonMobile} onClick={handleContextAddToCart}>
							{cartStatus === 'loading' ? <Spinner /> : <FontAwesomeIcon icon={faCartShopping} />}
							Thêm vào giỏ
						</button>
						<Link href={ctaHref} className={styles.watchMoreButtonMobile} onClick={() => setIsRedirectToDetail(true)}>
							{isRedirectToDetail ? <Spinner /> : <span>Xem chi tiết</span>}
						</Link>
					</>
				</ModalBottom>
			)}

			{cartStatus === 'success' && <ModalAlert title='Thành công' message='Sản phẩm đã được thêm vào giỏ hàng.' type='success' timeout={3000} onClose={() => setCartStatus('idle')} />}
		</>
	);
}

export default memo(ProductCard, (prevProps: ProductCartProps, nextProps: ProductCartProps) => {
	return toString(prevProps._id) === toString(nextProps._id);
});
