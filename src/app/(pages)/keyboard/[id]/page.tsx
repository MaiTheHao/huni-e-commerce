'use client';
import AppBody from '@/components/app-body/AppBody';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import styles from './ProductDetail.module.scss';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'next/navigation';
import { loggerService } from '@/server/services/logger.service';
import { IKeyboard } from '@/interfaces';
import Image from 'next/image';
import { calcDiscountPrice } from '@/util/calcDiscountPrice';
import clsx from 'clsx';
import ThumbnailNavButton from '@/components/thumnail-nav-button/ThumbnailNavButton';

type Props = {};

interface State {
	keyboard: IKeyboard | null;
	thumbnailIndex: number;
	discountedPrice: number;
}

const initialState: State = {
	keyboard: null,
	thumbnailIndex: 0,
	discountedPrice: 0,
};

function reducer(state: State, action: any) {
	switch (action.type) {
		case 'SET_KEYBOARD':
			const keyboard: IKeyboard = action.payload;
			const discountedPrice = calcDiscountPrice(keyboard.price, keyboard.discountPercent, true);
			return { ...state, keyboard: action.payload, discountedPrice };
		case 'SET_THUMBNAIL_INDEX':
			return { ...state, thumbnailIndex: action.payload };
		default:
			return state;
	}
}

function page({}: Props) {
	const [state, dispatch] = useReducer<State, any>(reducer, initialState);
	const params = useParams();

	const isDiscounted = useMemo(
		() =>
			Boolean(
				state.keyboard?.discountPercent &&
					state.keyboard.discountPercent > 0 &&
					state.keyboard.discountPercent <= 100 &&
					state.discountedPrice !== state.keyboard.price
			),
		[state.keyboard?.discountPercent, state.discountedPrice, state.keyboard?.price]
	);

	const handleChangeThumbnail = (index: number) => {
		dispatch({ type: 'SET_THUMBNAIL_INDEX', payload: index });
	};

	const handlePrevThumbnail = () => {
		const newIndex =
			(state.thumbnailIndex - 1 + (state.keyboard?.images.length || 0)) % (state.keyboard?.images.length || 1);
		handleChangeThumbnail(newIndex);
	};

	const handleNextThumbnail = () => {
		const newIndex = (state.thumbnailIndex + 1) % (state.keyboard?.images.length || 1);
		handleChangeThumbnail(newIndex);
	};

	const fetchKeyboardById = async () => {
		const keyboardId = params.id as string;
		if (!keyboardId) {
			loggerService.error('Không có ID bàn phím trong params');
			return;
		}
		const response = await fetch(`/api/v1/product/keyboard/${keyboardId}`);
		if (!response || response.status !== 200) {
			throw new Error('Không thể lấy thông tin bàn phím');
		}

		const { data } = await response.json();
		dispatch({ type: 'SET_KEYBOARD', payload: data });
	};

	useEffect(() => {
		fetchKeyboardById();
	}, []);

	return (
		<AppBody>
			<section className={styles.detail}>
				<div className={styles.images}>
					<div className={styles.mainImagesContainer}>
						<ul className={styles.mainImages}>
							{state.keyboard?.images.map((image, index) => {
								const isActive = index === state.thumbnailIndex;
								return (
									<li
										key={`product-detail-main-image-${index}`}
										className={clsx(styles.mainImage, { [styles.isActive]: isActive })}
										ref={(el) => {
											if (isActive && el) {
												el.scrollIntoView({
													behavior: 'smooth',
													block: 'nearest',
													inline: 'center',
												});
											}
										}}
									>
										<Image
											src={image}
											alt={state.keyboard?.name || ''}
											fill
											sizes='(max-width: 768px) 100vw, 50vw'
											style={{ objectFit: 'cover' }}
											quality={100}
											priority={isActive}
										/>
									</li>
								);
							})}
						</ul>
						{isDiscounted ? (
							<div className={styles.discountTag}>
								<span>-{state.keyboard?.discountPercent}%</span>
							</div>
						) : null}
						<ThumbnailNavButton
							className={styles.thumbnailsNav}
							onPrev={handlePrevThumbnail}
							onNext={handleNextThumbnail}
						/>
					</div>

					<div className={styles.thumbnailsContainer}>
						<ul className={styles.thumbnails}>
							{state.keyboard?.images.map((image, index) => {
								if (!image) return null;
								const isActive = index === state.thumbnailIndex;
								return (
									<li
										key={`product-detail-thumbnail-${index}`}
										className={clsx(styles.thumbnail, { [styles.isActive]: isActive })}
										onClick={() => handleChangeThumbnail(index)}
										ref={(el) => {
											if (isActive && el) {
												el.scrollIntoView({
													behavior: 'smooth',
													block: 'nearest',
													inline: 'center',
												});
											}
										}}
									>
										<Image
											src={image}
											alt={`Thumbnail ${index + 1}`}
											fill
											sizes='(max-width: 768px) 100vw, 560px'
											style={{ objectFit: 'cover' }}
											quality={80}
											priority={isActive}
										/>
									</li>
								);
							})}
						</ul>
						<ThumbnailNavButton
							className={styles.thumbnailsNav}
							onPrev={handlePrevThumbnail}
							onNext={handleNextThumbnail}
						/>
					</div>
				</div>
				<div className={styles.info}>
					<p className={styles.name}>{state.keyboard ? state.keyboard.name : 'Loading...'}</p>
					<div className={styles.line}></div>
					<div className={styles.price}>
						<span className={styles.originalPrice}>{state.keyboard?.price}</span>
						<span className={styles.discountedPrice}>{state.discountedPrice}</span>
					</div>
					<ul className={styles.features}></ul>
					<div className={styles.actions}></div>
				</div>
			</section>
			<section className={styles.content}>
				<div className={styles.description}>
					<h1 className={styles.title}></h1>
				</div>
				<div className={styles.specs}>
					<h1 className={styles.title}></h1>
				</div>
			</section>
		</AppBody>
	);
}

export default page;
