import ProductList from '@/components/product-list/ProductList';
import { IProduct } from '@/interfaces';
import { productsToProductCarts } from '@/util/productToProductCart.util';
import React from 'react';

type Props = {
	fetchWithPagination: (page: number, limit: number) => Promise<any>;
	productType: string;
};

async function HomeItemsSectionList({ fetchWithPagination, productType }: Props) {
	const products = (await fetchWithPagination(1, 4)) as IProduct[];
	const productCartItems = productsToProductCarts(products, productType);
	return <ProductList products={productCartItems} />;
}

export default HomeItemsSectionList;
