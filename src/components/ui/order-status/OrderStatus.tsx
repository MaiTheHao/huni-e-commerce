import React from 'react';
import styles from './OrderStatus.module.scss';
import { TOrderStatus } from '@/interfaces/entity/order/order.entity';
import { ORDER_STATUS_TEXT_MAP } from '@/consts/map-value';

interface OrderStatusProps {
	status: TOrderStatus;
	className?: string;
}

function OrderStatus({ status, className }: OrderStatusProps) {
	return <span className={`${styles.status} ${styles[`status--${status}`]} ${className || ''}`}>{ORDER_STATUS_TEXT_MAP[status] || 'Unknown'}</span>;
}

export default OrderStatus;
