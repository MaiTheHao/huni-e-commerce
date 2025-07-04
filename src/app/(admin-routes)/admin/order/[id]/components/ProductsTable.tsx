import React from 'react';
import { IOrder } from '@/interfaces/entity/order/order.entity';
import styles from '../OrderDetail.module.scss';
import { toLocalePrice } from '@/util';

interface ProductsTableProps {
	order: IOrder;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ order }) => {
	return (
		<div className={styles.section}>
			<h2 className={styles.section__title}>Danh sách sản phẩm</h2>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles['table__th--center']}>Ảnh</th>
						<th>Tên sản phẩm</th>
						<th>Danh mục</th>
						<th className={styles['table__th--center']}>Số lượng</th>
						<th className={styles['table__th--right']}>Đơn giá</th>
						<th className={styles['table__th--right']}>Giảm giá</th>
						<th className={styles['table__th--right']}>Thành tiền</th>
					</tr>
				</thead>
				<tbody>
					{order.items.map((item, idx) => (
						<tr key={idx}>
							<td className={styles['table__td--center']}>
								<img src={item.productImage} alt={item.productName} className={styles.product__image} />
							</td>
							<td>
								<div className={styles.product__name}>{item.productName}</div>
							</td>
							<td>
								<div className={styles.product__category}>{item.productCategory}</div>
							</td>
							<td className={styles['table__td--center']}>{item.quantity}</td>
							<td className={`${styles['table__td--right']} `}>{toLocalePrice(item.unitPrice)}</td>
							<td className={styles['table__td--right']}>{item.discountAmount ? `-${toLocalePrice(item.discountAmount)}` : '-'}</td>
							<td className={`${styles['table__td--right']} `}>{item.subtotalPrice.toLocaleString()}₫</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className={styles.summary}>
				<div className={styles.summary__item}>
					<span className={styles.summary__label}>Tạm tính:</span>
					<span className={`${styles.summary__value} `}>{toLocalePrice(order.subtotalPrice)}</span>
				</div>
				{order.vatAmount !== undefined && (
					<div className={styles.summary__item}>
						<span className={styles.summary__label}>VAT:</span>
						<span className={`${styles.summary__value} `}>{toLocalePrice(order.vatAmount)}</span>
					</div>
				)}
				{order.discountAmount !== undefined && (
					<div className={styles.summary__item}>
						<span className={styles.summary__label}>Giảm giá:</span>
						<span className={`${styles.summary__value} `}>-{toLocalePrice(order.discountAmount)}</span>
					</div>
				)}
				{order.shippingFee !== undefined && (
					<div className={styles.summary__item}>
						<span className={styles.summary__label}>Phí vận chuyển:</span>
						<span className={`${styles.summary__value} `}>{toLocalePrice(order.shippingFee)}</span>
					</div>
				)}
				<div className={styles.summary__item}>
					<span className={styles.summary__label}>Tổng cộng:</span>
					<span className={`${styles.summary__value} ${styles['summary__value--total']} price`}>{toLocalePrice(order.totalPrice)}</span>
				</div>
			</div>
		</div>
	);
};

export default ProductsTable;
