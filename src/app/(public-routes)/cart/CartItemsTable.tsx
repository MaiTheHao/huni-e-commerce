'use client';
import React from 'react';
import styles from './Cart.module.scss';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Table from '@/components/ui/table/Table';
import Quantity from '@/components/ui/quantity/Quantity';
import { calcDiscountedPrice, toLocalePrice } from '@/util/price.util';
import { useCartContext } from '@/contexts/CartContext/useCartContext';
import { loggerService } from '@/services/logger.service';

function CartItemsTable() {
	const { items, products, loading, handleRemove, handleQuantity } = useCartContext();

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
										loggerService.warning(`Sản phẩm với ID ${item.productId} không tồn tại trong danh sách sản phẩm.`);
										return null;
									}

									const discountedPrice = calcDiscountedPrice(product.price, product.discountPercent, true);
									const subtotal = discountedPrice * item.quantity;

									if (!product) {
										return null;
									}

									return (
										<li key={item.productId} className={styles.cartItem}>
											<button className={styles.itemRemoveButton} onClick={() => handleRemove(item.productId)}>
												<FontAwesomeIcon icon={faTrashCan} />
											</button>
											<div className={styles.itemImage}>{product?.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className={styles.productImage} />}</div>
											<div className={styles.itemName}>
												<span>{product.name}</span>
												<span className={styles.itemMobilePrice}>{toLocalePrice(subtotal)}</span>
											</div>
											<div className={styles.itemQuantityControl}>
												<Quantity
													value={item.quantity}
													onChange={(newQuantity) => handleQuantity(item.productId, newQuantity)}
													min={1}
													max={product.stock}
													className={styles.itemQuantityControlInput}
													debounceTime={500}
												/>
											</div>
											<span className={styles.itemPrice}>{toLocalePrice(subtotal)}</span>
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
