'use client';
import React, { memo } from 'react';
import styles from '../Dashboard.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesStacked, faClock, faSackDollar, faTruckRampBox, faUser } from '@fortawesome/free-solid-svg-icons';
import { toLocalePrice } from '@/util';
import { ICustomerStats, IOrderStats, IProductStats } from '../AdminDashboardServerWrapper';

type Props = {
	orderStats: IOrderStats;
	customerStats: ICustomerStats;
	productStats: IProductStats;
};

type CardProps = {
	icon: any;
	label: string;
	value: React.ReactNode;
	className?: string;
};

const Card = memo(function Card({ icon, label, value, className }: CardProps) {
	return (
		<li className={`${styles.card} ${className || ''}`}>
			<FontAwesomeIcon icon={icon} />
			<div className={styles.cardContent}>
				<span className={styles.cardLabel}>{label}</span>
				<span className={styles.cardValue}>{value}</span>
			</div>
		</li>
	);
});

function AdminDashboardCards({ orderStats, customerStats, productStats }: Props) {
	return (
		<ul className={styles.cards}>
			<Card icon={faSackDollar} label='Tổng doanh thu' value={toLocalePrice(orderStats.delivered.totalPrice)} className={styles['card--highlight']} />
			<Card icon={faClock} label='Đơn chờ xử lí' value={orderStats.pending.amount} className={styles['card--blue']} />
			<Card icon={faTruckRampBox} label='Đơn hàng' value={orderStats.amount} className={styles['card--blue']} />
			<Card icon={faUser} label='Khách hàng' value={customerStats.total} className={styles['card--blue']} />
			<Card icon={faBoxesStacked} label='Sản phẩm' value={productStats.total} className={styles['card--blue']} />
		</ul>
	);
}

export default memo(AdminDashboardCards);
