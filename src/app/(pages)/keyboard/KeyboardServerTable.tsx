import React from 'react';
import KeyboardsClientTable from './KeyboardsClientTable';
import { getKeyboardWithPagination } from '@/server/actions/keyboard/get-keyboards-with-pagination';
import { IPagination, IProductCart } from '@/interfaces';
import { countDocumentByCategory } from '@/server/actions/count-document-by-category';
import { getPagination } from '@/util/getPagination';
import { productsToProductCarts } from '@/util/productToProductCart.util';

type Props = {};
const LIMIT = 8;

async function KeyboardServerTable({}: Props) {
	let cartItems: IProductCart[] = [];
	let pagination: IPagination = {
		page: 1,
		limit: 0,
		total: 0,
		totalPages: 0,
	};

	const response = await getKeyboardWithPagination(1, LIMIT);
	const total = await countDocumentByCategory('keyboard');
	if (response.length > 0) {
		cartItems = productsToProductCarts(response, 'keyboard');
		pagination = getPagination(1, LIMIT, total);
	}

	return <KeyboardsClientTable initialKeyboards={cartItems} initialPagination={pagination} />;
}

export default KeyboardServerTable;
