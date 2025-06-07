'use client';
import React from 'react';
import styles from './Cart.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { ICartItem, IProduct } from '@/interfaces';
import Table from '@/components/ui/table/Table';
import Quantity from '@/components/ui/quantity/Quantity';
import { toLocalePrice } from '@/util/toLocalePrice.util';

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
													{toLocalePrice(product.price * item.quantity)}
												</span>
											</div>
											<div className={styles.itemQuantityControl}>
												<Quantity
													value={item.quantity}
													onChange={(newQuantity) => onQuantity(item.productId, newQuantity)}
													min={1}
													max={product.stock}
													className={styles.itemQuantityControlInput}
													debounceTime={500}
												/>
											</div>
											<span className={styles.itemPrice}>
												{toLocalePrice(product.price * item.quantity)}
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
