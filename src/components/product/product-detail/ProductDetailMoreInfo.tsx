'use client';
import React, { useEffect, useState } from 'react';
import styles from './ProductDetail.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import clsx from 'clsx';
import { IProductDetailMarkdown } from '@/interfaces';

type ProductDetailMoreInfoProps = {
	productId: string;
};

const pages = [
	{
		label: 'Mô tả',
		id: 'description',
	},
	{
		label: 'Thông số kỹ thuật',
		id: 'specs',
	},
];

const fetchProductDetailMarkdown = async (productId: string): Promise<IProductDetailMarkdown> => {
	try {
		const response = await fetch(`/api/v1/product/detail/markdown/${productId}`);
		if (!response || response.status !== 200) {
			throw new Error('Không thể lấy thông tin markdown');
		}
		const { data } = await response.json();
		return data;
	} catch (error) {
		throw error;
	}
};

function ProductDetailMoreInfo({ productId }: ProductDetailMoreInfoProps) {
	const [content, setContent] = useState<IProductDetailMarkdown | null>(null);
	const [curPage, setCurPage] = useState<string>(pages[0].id);

	const isCurPage = (pageId: string) => curPage === pageId;
	const handlePageChange = (pageId: string) => setCurPage(pageId);

	useEffect(() => {
		fetchProductDetailMarkdown(productId)
			.then(setContent)
			.catch(() => setContent(null));
	}, [productId]);

	const renderContent = () => {
		if (!content) return 'Thông tin không có sẵn';
		if (curPage === 'description') return content.description || 'Thông tin không có sẵn';
		if (curPage === 'specs') return content.specifications || 'Thông tin không có sẵn';
		return 'Thông tin không có sẵn';
	};

	return (
		<section className={styles.moreInfo}>
			<ul className={styles.moreInfo__pages}>
				{pages.map((page) => (
					<li
						key={`product detail moreinfo page ${page.id}`}
						className={clsx(styles.moreInfo__page, {
							[styles['moreInfo__page--active']]: isCurPage(page.id),
						})}
						onClick={() => handlePageChange(page.id)}
					>
						{page.label}
					</li>
				))}
			</ul>
			<div className={'line'}></div>
			<section className={clsx(styles.moreInfo__content, 'markdown', { [styles.specs]: isCurPage('specs') })}>
				<ReactMarkdown remarkPlugins={[remarkGfm]}>{renderContent()}</ReactMarkdown>
			</section>
		</section>
	);
}

export default ProductDetailMoreInfo;
