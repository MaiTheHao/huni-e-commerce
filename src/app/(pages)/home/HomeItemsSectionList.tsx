import ProductList from '@/components/product-list/ProductList';
import { IProduct, IProductCart } from '@/interfaces';
import { loggerService } from '@/services/logger.service';
import { productsToProductCarts } from '@/util/productToProductCart.util';
import React from 'react';

type Props = {
	fetchWithPagination: (page: number, limit: number) => Promise<any>;
	productType: string;
};

async function HomeItemsSectionList({ fetchWithPagination, productType }: Props) {
	let productCartItems: IProductCart[] = [];
	try {
		const products = (await fetchWithPagination(1, 4)) as IProduct[];
		productCartItems = productsToProductCarts(products, productType);
	} catch (error) {
		loggerService.error('Lỗi khi lấy danh sách sản phẩm với phân trang', error);
	}

	return <ProductList products={productCartItems} />;
}

export default HomeItemsSectionList;
