'use client';
import React, { memo } from 'react';
import styles from '../../../Admin.module.scss';
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
		<li className={`${styles['dashboard-card']} ${className || ''}`}>
			<FontAwesomeIcon icon={icon} />
			<div className={styles['dashboard-card__content']}>
				<span className={styles['dashboard-card__label']}>{label}</span>
				<span className={styles['dashboard-card__value']}>{value}</span>
			</div>
		</li>
	);
});

function AdminDashboardCards({ orderStats, customerStats, productStats }: Props) {
	return (
		<ul className={styles['dashboard-cards']}>
			<Card icon={faSackDollar} label='Tổng doanh thu' value={toLocalePrice(orderStats.delivered.totalPrice)} className={styles['dashboard-card--highlight']} />
			<Card icon={faClock} label='Đơn chờ xử lí' value={orderStats.pending.amount} className={styles['dashboard-card--blue']} />
			<Card icon={faTruckRampBox} label='Đơn hàng' value={orderStats.amount} className={styles['dashboard-card--blue']} />
			<Card icon={faUser} label='Khách hàng' value={customerStats.total} className={styles['dashboard-card--blue']} />
			<Card icon={faBoxesStacked} label='Sản phẩm' value={productStats.total} className={styles['dashboard-card--blue']} />
		</ul>
	);
}

export default memo(AdminDashboardCards);
