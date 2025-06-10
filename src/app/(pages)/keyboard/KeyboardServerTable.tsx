import React from 'react';
import KeyboardsClientTable from './KeyboardsClientTable';
import { IPagination, IProductCard, IProductFilter } from '@/interfaces';
import { getPagination } from '@/util/page.util';
import { loggerService } from '@/services/logger.service';
import { getKeyboardWithPagination, countKeyboard, getKeyboardFilter } from '@/server/actions';
import { convertDocumentToObject, convertProductsToCards } from '@/util/convert';
import { DEFAULT_KEYBOARD_FILTER, DEFAULT_KEYBOARD_PAGINATION } from './default_props';

type Props = {};

async function KeyboardServerTable({}: Props) {
	let cardItems: IProductCard[] = [];
	let pagination: IPagination = DEFAULT_KEYBOARD_PAGINATION;
	let filters: IProductFilter = { ...DEFAULT_KEYBOARD_FILTER };

	try {
		const response = await getKeyboardWithPagination(1, pagination.limit);
		const total = await countKeyboard();
		if (response.length > 0) {
			cardItems = convertProductsToCards(response, 'keyboard');
			pagination = getPagination(1, pagination.limit, total);
		}
	} catch (error) {
		loggerService.error('Lỗi khi lấy danh sách bàn phím với phân trang', error);
	}

	try {
		const response = await getKeyboardFilter();
		if (response) {
			filters = response;
		}
	} catch (error) {
		loggerService.error('Lỗi khi lấy bộ lọc bàn phím', error);
	}

	return <KeyboardsClientTable initialKeyboards={cardItems} initialPagination={pagination} initialFilter={filters} />;
}

export default KeyboardServerTable;
