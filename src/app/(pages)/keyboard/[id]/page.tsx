'use client';
import AppBody from '@/components/app-body/AppBody';
import React from 'react';
import { useParams } from 'next/navigation';
import { IKeyboard } from '@/interfaces';
import ProductDetail, { ProductDetailProps } from '@/components/product-detail/ProductDetail';

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
	{ field: 'model', label: 'Model' },
	{ field: 'series', label: 'Series' },
	{ field: 'layout', label: 'Layout' },
	{ field: 'switchType', label: 'Switch' },
	{ field: 'hotswap', label: 'Hotswap' },
	{ field: 'connectivity', label: 'Kết nối' },
	{ field: 'caseMaterial', label: 'Vỏ' },
	{ field: 'rgb', label: 'RGB' },
	{ field: 'rapidTrigger', label: 'Rapid Trigger' },
];

function KeyboardDetailPage() {
	const params = useParams();
	const keyboardId = params.id as string;

	return (
		<AppBody>
			<ProductDetail<IKeyboard>
				productId={keyboardId}
				attrs={keyboardAttrs}
				fetchProductById={fetchKeyboardById}
			/>
		</AppBody>
	);
}

export default KeyboardDetailPage;
