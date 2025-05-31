'use client';
import { useState, useEffect } from 'react';

export const BREAKPOINT_XS = 0;
export const BREAKPOINT_XS_PLUS = 480;
export const BREAKPOINT_SM = 576;
export const BREAKPOINT_MD = 768;
export const BREAKPOINT_LG = 992;
export const BREAKPOINT_XL = 1200;
export const BREAKPOINT_XXL = 1400;

/**
 * Hook useScreenSize
 *
 * Hook này giúp lấy thông tin kích thước màn hình (width, height) hiện tại của trình duyệt.
 * Tự động cập nhật khi người dùng thay đổi kích thước cửa sổ (resize).
 *
 * Cách sử dụng:
 *
 * const { width, height, isMobile, isTablet, isDesktop } = useScreenSize();
 *
 * - width: Chiều rộng màn hình (px)
 * - height: Chiều cao màn hình (px)
 * - isMobile: true nếu màn hình nhỏ hơn BREAKPOINT_MD
 * - isTablet: true nếu màn hình từ BREAKPOINT_MD đến dưới BREAKPOINT_LG
 * - isDesktop: true nếu màn hình từ BREAKPOINT_LG trở lên
 *
 * @returns { width: number, height: number, isMobile: boolean, isTablet: boolean, isDesktop: boolean }
 */

function getScreenSize() {
	if (typeof window === 'undefined') {
		return {
			width: 0,
			height: 0,
			isMobile: false,
			isTablet: false,
			isDesktop: false,
		};
	}

	const width = window.innerWidth;
	const height = window.innerHeight;
	return {
		width,
		height,
		isMobile: width < BREAKPOINT_MD,
		isTablet: width >= BREAKPOINT_MD && width < BREAKPOINT_LG,
		isDesktop: width >= BREAKPOINT_LG,
	};
}

function useScreenSize() {
	const [screenSize, setScreenSize] = useState(getScreenSize());

	useEffect(() => {
		function handleResize() {
			setScreenSize(getScreenSize());
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return screenSize;
}

export default useScreenSize;
