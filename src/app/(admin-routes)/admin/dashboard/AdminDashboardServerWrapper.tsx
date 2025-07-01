import React from 'react';
import styles from '../../Admin.module.scss';
import { IOrder } from '@/interfaces/entity/order/order.entity';
import AdminDashboardClientWrapper from './AdminDashboardClientWrapper';
import { getPotentialCustomers } from '@/server/actions/user';
import { getOrdersWithPagination } from '@/server/actions/order';
import { countUsers } from '@/server/actions/user/count';
import { IUser } from '@/interfaces';
import { countProduct } from '@/server/actions/product/count-product';

export interface IOrderStats {
	orders: IOrder[] | null;
	amount: number;
	delivered: {
		amount: number;
		totalPrice: number;
	};
	pending: {
		amount: number;
		totalPrice: number;
	};
}

export interface ICustomerStats {
	total: number;
	potential: IUser[];
}

export interface IProductStats {
	total: number;
}

export default async function AdminDashboardServerWrapper() {
	// ORDER LOGIC
	const [orderError, orderResult] = await getOrdersWithPagination(1, 10, {}, { _id: -1 });
	const orders = orderResult?.data || null;
	const successOrders = orders ? orders.filter((order) => order.status === 'delivered') : [];
	const pendingOrders = orders ? orders.filter((order) => order.status === 'pending') : [];

	const orderStats: IOrderStats = {
		orders: orders,
		amount: orders ? orders.length : 0,
		delivered: {
			amount: successOrders.length,
			totalPrice: successOrders.reduce((sum, order) => sum + order.totalPrice, 0),
		},
		pending: {
			amount: pendingOrders.length,
			totalPrice: pendingOrders.reduce((sum, order) => sum + order.totalPrice, 0),
		},
	};

	// CUSTOMER LOGIC
	const [, potentialCustomers] = await getPotentialCustomers(10);
	const [, totalCustomers] = await countUsers();

	const customerStats: ICustomerStats = {
		total: totalCustomers || 0,
		potential: potentialCustomers || [],
	};

	// PRODUCT LOGIC
	const [, countProducts] = await countProduct();
	const productStats = {
		total: countProducts || 0,
	};

	return (
		<div className={styles['dashboard-container']}>
			<div className={styles['dashboard-block']}>
				<AdminDashboardClientWrapper orderStats={orderStats} customerStats={customerStats} productStats={productStats} />
			</div>
		</div>
	);
}
