'use client';
import React from 'react';
import styles from './Cart.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ICartItem, IProduct } from '@/interfaces';
import Table from '@/components/table/Table';
import Quantity from '@/components/quantity/Quantity';

type Props = {
	items: ICartItem[];
	products: Record<string, IProduct | null>;
	loading: boolean;
	onRemove: (productId: string) => void;
	onQuantity: (productId: string, quantity: number) => void;
};

function CartItemsTable({ items, products, loading, onRemove, onQuantity }: Props) {
	return (
		<Table
			sections={[
				{
					titles: ['Danh sách sản phẩm'],
					children:
						!loading && items.length === 0 ? (
							<p className='info'>Giỏ hàng trống.</p>
						) : (
							<ul className={styles.itemsList}>
								{items.map((item) => {
									const product = products[item.productId];

									if (!product) {
										return null;
									}

									return (
										<li key={item.productId} className={styles.cartItem}>
											<button
												className={styles.itemRemoveButton}
												onClick={() => onRemove(item.productId)}
											>
												<FontAwesomeIcon icon={faTrashCan} />
											</button>
											<div className={styles.itemImage}>
												{product?.images?.[0] && (
													<Image
														src={product.images[0]}
														alt={product.name}
														fill
														className={styles.productImage}
													/>
												)}
											</div>
											<div className={styles.itemName}>
												<span>{product.name}</span>
												<span className={styles.itemMobilePrice}>
													{(product.price * item.quantity).toLocaleString('vi-VN', {
														style: 'currency',
														currency: 'VND',
													})}
												</span>
											</div>
											<div className={styles.itemQuantityControl}>
												<Quantity
													value={item.quantity}
													onNext={() => onQuantity(item.productId, item.quantity + 1)}
													onPrev={() => onQuantity(item.productId, item.quantity - 1)}
													onInput={(value) => onQuantity(item.productId, value)}
													prevDisabled={item.quantity <= 1}
												/>
											</div>
											<span className={styles.itemPrice}>
												{(product.price * item.quantity).toLocaleString('vi-VN', {
													style: 'currency',
													currency: 'VND',
												})}
											</span>
										</li>
									);
								})}
							</ul>
						),
				},
			]}
			loading={loading}
			className={styles.itemsTable}
		/>
	);
}

export default CartItemsTable;
