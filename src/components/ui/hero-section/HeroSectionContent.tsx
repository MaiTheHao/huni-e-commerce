// filepath: d:\MyWorkSpace\Projects\Web\E-Commerce Huni\source\src\components\hero-section\HeroSectionContent.tsx
'use client';
import React, { useState } from 'react';
import styles from './HeroSection.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { IHeroSection } from '@/interfaces';
import Spinner from '../spinner/Spinner';

export type HeroSectionContentProps = {
	items: IHeroSection[];
	current: number;
};

// TODO: FIX BUG AUTO SCROLL
function HeroSectionContent({ items, current }: HeroSectionContentProps) {
	const [isRedirecting, setIsRedirecting] = useState(false);

	return (
		<ul className={styles.list}>
			{items.map((product, idx) => {
				const isActive = idx === current;
				const attrs = product.attrs?.slice(0, 3);
				const hasContent = product.name || (attrs && attrs.length > 0) || (product.cta && product.ctaHref);

				return (
					<li
						key={product._id}
						className={`${styles.item} ${isActive ? styles.active : ''}`}
						ref={(el) => {
							if (isActive && el) {
								el.scrollIntoView({
									behavior: 'smooth',
									block: 'nearest',
									inline: 'start',
								});
							}
						}}
					>
						{product.image && (
							<Image
								src={product.image}
								alt={`Hình ảnh sản phẩm: ${product.name}`}
								fill
								sizes='(max-width: 576px) 100vw, (max-width: 768px) 90vw, 80vw'
								priority
								quality={100}
								className={styles.image}
								style={{ objectFit: 'cover' }}
							/>
						)}

						{hasContent && (
							<div className={styles.bottom}>
								<div className={styles.content}>
									{product.name && <h3 className={styles.title}>{product.name}</h3>}
									{attrs && attrs.length > 0 && <p className={styles.attrs}>{attrs.join(' | ')}</p>}
									{product.cta && product.ctaHref && (
										<Link
											className={clsx('cta-button', styles.cta)}
											href={product.ctaHref}
											onClick={() => setIsRedirecting(true)}
										>
											{isRedirecting ? <Spinner /> : <span>{product.cta}</span>}
										</Link>
									)}
								</div>
							</div>
						)}
					</li>
				);
			})}
		</ul>
	);
}

export default HeroSectionContent;
