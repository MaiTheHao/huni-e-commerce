import React from 'react';
import KeyboardsClientTable from './KeyboardsClientTable';
import { getKeyboardWithPagination } from '@/server/actions/keyboard/get-keyboards-with-pagination';
import { IPagination, IProductCart } from '@/interfaces';
import { countDocumentByCategory } from '@/server/actions/count-document-by-category';
import { getPagination } from '@/util/getPagination';
import { productsToProductCarts } from '@/util/productToProductCart.util';
import { loggerService } from '@/server/services/logger.service';

type Props = {};
const LIMIT = 8;

async function KeyboardServerTable({}: Props) {
	let cartItems: IProductCart[] = [];
	let pagination: IPagination = {
		page: 1,
		limit: LIMIT,
		total: 0,
		totalPages: 0,
	};

	try {
		const response = await getKeyboardWithPagination(1, LIMIT);
		const total = await countDocumentByCategory('keyboard');
		if (response.length > 0) {
			cartItems = productsToProductCarts(response, 'keyboard');
			pagination = getPagination(1, LIMIT, total);
		}
	} catch (error) {
		loggerService.error('Lỗi khi lấy danh sách bàn phím với phân trang', error);
	}

	return <KeyboardsClientTable initialKeyboards={cartItems} initialPagination={pagination} />;
}

export default KeyboardServerTable;
