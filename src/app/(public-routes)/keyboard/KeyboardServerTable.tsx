import KeyboardsClientTable from './KeyboardsClientTable';
import { IPagination, IProductCard, IProductFilter } from '@/interfaces';
import { getPagination } from '@/util/page.util';
import { convertProductsToCards } from '@/util/convert';
import { DEFAULT_KEYBOARD_FILTER, DEFAULT_KEYBOARD_PAGINATION } from './default_props';
import { loggerService } from '@/services/logger.service';
import { BASE_URL } from '@/consts/url';

type ISearchFilterKeyboardRequest = {
	page: number;
	limit: number;
	keyword: string;
	criteria: any;
	sort: any;
};

async function getKeyboards(page: number, limit: number, filterCriteria: ISearchFilterKeyboardRequest['criteria'], sortCriteria: ISearchFilterKeyboardRequest['sort'], signal?: AbortSignal) {
	const response = await fetch(`${BASE_URL}/product/keyboard/search-filter`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			page,
			limit,
			keyword: '',
			criteria: filterCriteria,
			sort: sortCriteria,
		}),
		signal,
		next: { revalidate: 5 * 60 },
	});
	return response.json();
}

async function getKeyboardFilterSetup() {
	const response = await fetch(`${BASE_URL}/product/keyboard/search-filter`, {
		method: 'GET',
		next: { revalidate: 24 * 60 * 60 },
	});
	if (!response.ok) {
		loggerService.error('Lỗi khi lấy bộ lọc bàn phím', response.statusText);
		return null;
	}
	return response.json();
}

async function KeyboardServerTable() {
	let cardItems: IProductCard[] = [];
	let pagination: IPagination = DEFAULT_KEYBOARD_PAGINATION;
	let filters: IProductFilter = { ...DEFAULT_KEYBOARD_FILTER };

	try {
		const data = await getKeyboards(1, pagination.limit, {}, {});
		const keyboards = data?.data?.keyboards ?? [];
		const paginationData = data?.data?.pagination;
		if (keyboards.length > 0) {
			cardItems = convertProductsToCards(keyboards, 'keyboard');
			if (paginationData) {
				pagination = getPagination(paginationData.page, paginationData.limit, paginationData.total);
			}
		}
	} catch (error) {
		loggerService.error('Lỗi fetchKeyboardsApi', error);
	}

	const filterSetup = await getKeyboardFilterSetup();
	if (filterSetup?.data) {
		filters = filterSetup.data;
	}

	return <KeyboardsClientTable initialKeyboards={cardItems} initialPagination={pagination} initialFilter={filters} />;
}

export default KeyboardServerTable;
