'use client';
import React, { useState } from 'react';
import styles from './HeroSection.module.scss';
import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { IHeroSection } from '@/interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

function HeroSectionItem({ image, name, attrs, cta, ctaHref }: Partial<IHeroSection>) {
	const [isRedirecting, setIsRedirecting] = useState(false);

	attrs = attrs?.slice(0, 3);
	const hasContent = name || (attrs && attrs.length > 0) || (cta && ctaHref);

	return (
		<>
			{image && (
				<Image
					src={image}
					alt={name ? `Hình ảnh sản phẩm: ${name}` : 'Hình ảnh sản phẩm'}
					fill
					sizes='(max-width: 576px) 100vw, (max-width: 768px) 90vw, 80vw'
					priority
					quality={100}
					className={styles.productImage}
					style={{ objectFit: 'cover' }}
				/>
			)}

			{hasContent && (
				<div className={styles.bottomSection}>
					<div className={styles.content}>
						{name && <h3 className={styles.productName}>{name}</h3>}
						{attrs && attrs.length > 0 && <p className={styles.productAttrs}>{attrs.join(' | ')}</p>}
						{cta && ctaHref && (
							<Link
								className={clsx('cta-button', styles.ctaButton)}
								href={ctaHref}
								onClick={() => setIsRedirecting(true)}
							>
								{isRedirecting ? <FontAwesomeIcon icon={faSpinner} spin /> : <span>{cta}</span>}
							</Link>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default HeroSectionItem;
