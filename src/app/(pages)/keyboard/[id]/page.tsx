'use client';
import AppBody from '@/components/layout/app-body/AppBody';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IKeyboard } from '@/interfaces';
import ProductDetail, { ProductDetailProps } from '@/components/product/product-detail/ProductDetail';

const fetchKeyboardById = async (id: string): Promise<IKeyboard> => {
	const response = await fetch(`/api/v1/product/keyboard/${id}`);
	if (!response || response.status !== 200) {
		throw new Error('Không thể lấy thông tin bàn phím');
	}
	const { data } = await response.json();
	return data;
};

const keyboardAttrs: ProductDetailProps<IKeyboard>['attrs'] = [
	{ field: 'brand', label: 'Thương hiệu' },
	{ field: 'layout', label: 'Layout' },
	{ field: 'switchType', label: 'Switch' },
	{ field: 'connectivity', label: 'Kết nối' },
	{ field: 'caseMaterial', label: 'Vỏ' },
];

function KeyboardDetailPage() {
	const params = useParams();
	const keyboardId = params.id as string;

	return (
		<AppBody>
			<ProductDetail<IKeyboard> productId={keyboardId} attrs={keyboardAttrs} fetchProductById={fetchKeyboardById} />
		</AppBody>
	);
}

export default KeyboardDetailPage;
