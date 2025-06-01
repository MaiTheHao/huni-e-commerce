'use client';
import React, { useState, memo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import styles from './ProductCart.module.scss';
import useScreenSize, { BREAKPOINT_LG } from '@/hooks/useScreenSize';
import ModalBottom from '../modal-bottom/ModalBottom';
import { IProductCart } from '@/interfaces';
import ProductCartImage from './ProductCartImage';
import ProductCartInfo from './ProductCartInfo';
import Spinner from '../spinner/Spinner';

export type ProductCartProps = {} & IProductCart;

function ProductCart({ _id, name, price, discountPercent, image, ctaHref }: ProductCartProps) {
	const { width } = useScreenSize();
	const [isActive, setIsActive] = useState(false);
	const [isRedirectToDetail, setIsRedirectToDetail] = useState(false);
	const isAbleToShowModal = width <= BREAKPOINT_LG;

	const handleAddToCart = () => {};

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
							[styles.touched]: isActive,
						})}
					>
						<button className={clsx(styles.addToCartButton, styles.productActionsButton)}>
							<FontAwesomeIcon icon={faCartShopping} />
						</button>
						<Link
							href={ctaHref}
							className={clsx(styles.watchMoreButton, styles.productActionsButton)}
							onClick={() => setIsRedirectToDetail(true)}
						>
							{isRedirectToDetail ? <Spinner /> : <span>Xem chi tiết</span>}
						</Link>
					</div>
				</ProductCartImage>
				<ProductCartInfo name={name} price={price} discountPercent={discountPercent} />
			</article>

			{isAbleToShowModal && isActive && (
				<ModalBottom isOpen={isActive} onClose={() => setIsActive(false)}>
					<>
						<button className={styles.addToCartButtonMobile} onClick={handleAddToCart}>
							<FontAwesomeIcon icon={faCartShopping} />
							Thêm vào giỏ
						</button>
						<Link
							href={ctaHref}
							className={styles.watchMoreButtonMobile}
							onClick={() => setIsRedirectToDetail(true)}
						>
							{isRedirectToDetail ? <Spinner /> : <span>Xem chi tiết</span>}
						</Link>
					</>
				</ModalBottom>
			)}
		</>
	);
}

export default memo(ProductCart, (prevProps: ProductCartProps, nextProps: ProductCartProps) => {
	return prevProps._id === nextProps._id;
});
