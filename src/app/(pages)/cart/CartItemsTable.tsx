// 'use client';
// import React from 'react';
// import styles from './Cart.module.scss';
// import Image from 'next/image';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
// import { ICart, Product } from '@/entities';
// import Table from '@/components/table/Table';

// type CartItemsTableProps = {
// 	items: Product[];
// 	cart: ICart | null;
// 	loading: boolean;
// 	onRemoveItem: (productId: string) => void;
// 	onQuantityChange: (productId: string, newQuantity: number) => void;
// };

// const CartItemsTable: React.FC<CartItemsTableProps> = ({ items, cart, loading, onRemoveItem, onQuantityChange }) => {
// 	const itemsContent = (
// 		<ul className={styles.itemsList}>
// 			{items.map((item, idx) => {
// 				const itemQuantity = cart?.items.find((i) => i.productId === item.id)?.quantity || 0;
// 				return (
// 					<li key={item.id} className={styles.cartItem}>
// 						<button className={styles.itemRemoveButton} onClick={() => onRemoveItem(item.id)}>
// 							<FontAwesomeIcon icon={faTrashCan} />
// 						</button>
// 						<div className={styles.itemImage}>
// 							<Image src={item.images[0]} alt={item.name} fill className={styles.productImage} />
// 						</div>
// 						<div className={styles.itemName}>
// 							<span>{item.name}</span>
// 							<span className={styles.itemMobilePrice}>
// 								{(item.price * itemQuantity).toLocaleString('vi-VN', {
// 									style: 'currency',
// 									currency: 'VND',
// 								})}
// 							</span>
// 						</div>
// 						<div className={styles.itemQuantityControl}>
// 							<button
// 								className={styles.quantityButton}
// 								onClick={() => onQuantityChange(item.id, itemQuantity - 1)}
// 							>
// 								-
// 							</button>
// 							<input
// 								className={styles.quantityInput}
// 								value={itemQuantity}
// 								onChange={(e) => {
// 									const value = parseInt(e.target.value, 10);
// 									if (!isNaN(value) && value >= 0) {
// 										onQuantityChange(item.id, value);
// 									} else {
// 										onQuantityChange(item.id, 0);
// 									}
// 								}}
// 							/>
// 							<button
// 								className={styles.quantityButton}
// 								onClick={() => onQuantityChange(item.id, itemQuantity + 1)}
// 							>
// 								+
// 							</button>
// 						</div>
// 						<span className={styles.itemPrice}>
// 							{(item.price * itemQuantity).toLocaleString('vi-VN', {
// 								style: 'currency',
// 								currency: 'VND',
// 							})}
// 						</span>
// 					</li>
// 				);
// 			})}
// 		</ul>
// 	);

// 	const nullItemsContent = <p className='info'>Giỏ hàng trống.</p>;

// 	const isNoItems = !loading && items.length === 0;

// 	const sections = [
// 		{
// 			titles: ['Danh sách sản phẩm'],
// 			children: isNoItems ? nullItemsContent : itemsContent,
// 		},
// 	];

// 	return <Table sections={sections} loading={loading} className={styles.itemsTable} />;
// };

// export default CartItemsTable;
