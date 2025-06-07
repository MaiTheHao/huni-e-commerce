'use client';
import React, { useState, useRef, useEffect } from 'react';
import styles from './ToolTip.module.scss';

/**
 * Vị trí hiển thị của tooltip
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Kích thước của tooltip
 */
export type TooltipSize = 'small' | 'medium' | 'large';

/**
 * Props cho component ToolTip
 */
export interface ToolTipProps {
	/** Nội dung hiển thị trong tooltip */
	content: React.ReactNode;

	/** Vị trí hiển thị tooltip. Mặc định: 'top' */
	position?: TooltipPosition;

	/** Kích thước của tooltip. Mặc định: 'medium' */
	size?: TooltipSize;

	/** Element con sẽ được bọc và kích hoạt tooltip */
	children: React.ReactNode;

	/** Độ trễ trước khi hiển thị tooltip (ms). Mặc định: 300 */
	delay?: number;

	/** Có tự động điều chỉnh vị trí khi tooltip bị che khuất không. Mặc định: true */
	autoAdjust?: boolean;

	/** Có hiển thị mũi tên chỉ hướng không. Mặc định: true */
	showArrow?: boolean;

	/** Có bật tooltip không. Mặc định: true */
	enabled?: boolean;

	/** Class CSS tùy chỉnh cho tooltip */
	className?: string;

	/** Class CSS tùy chỉnh cho wrapper */
	wrapperClassName?: string;

	/** Callback khi tooltip hiển thị */
	onShow?: () => void;

	/** Callback khi tooltip ẩn */
	onHide?: () => void;
}

/**
 * Component ToolTip - Hiển thị thông tin bổ sung khi hover hoặc focus vào element
 *
 * @example
 * ```tsx
 * // Sử dụng cơ bản
 * <ToolTip content="Đây là tooltip">
 *   <button>Hover me</button>
 * </ToolTip>
 *
 * // Với nhiều tùy chọn
 * <ToolTip
 *   content="Tooltip với nhiều tùy chọn"
 *   position="bottom"
 *   size="large"
 *   delay={500}
 *   showArrow={false}
 * >
 *   <span>Element có tooltip</span>
 * </ToolTip>
 *
 * // Tooltip với nội dung phức tạp
 * <ToolTip
 *   content={
 *     <div>
 *       <strong>Tiêu đề</strong>
 *       <p>Mô tả chi tiết</p>
 *     </div>
 *   }
 *   position="right"
 * >
 *   <img src="image.jpg" alt="Hình ảnh" />
 * </ToolTip>
 * ```
 *
 * @param props - Props của component
 * @returns JSX Element
 */
const ToolTip: React.FC<ToolTipProps> = ({
	content,
	position = 'top',
	size = 'medium',
	children,
	delay = 100,
	autoAdjust = true,
	showArrow = true,
	enabled = true,
	className = '',
	wrapperClassName = '',
	onShow,
	onHide,
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const [actualPosition, setActualPosition] = useState<TooltipPosition>(position);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	/**
	 * Tính toán vị trí tối ưu cho tooltip
	 */
	const calculateOptimalPosition = (): TooltipPosition => {
		if (!autoAdjust || !wrapperRef.current || !tooltipRef.current) {
			return position;
		}

		const wrapperRect = wrapperRef.current.getBoundingClientRect();
		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		const spaceTop = wrapperRect.top;
		const spaceBottom = viewport.height - wrapperRect.bottom;
		const spaceLeft = wrapperRect.left;
		const spaceRight = viewport.width - wrapperRect.right;

		// Kiểm tra không gian theo từng hướng
		switch (position) {
			case 'top':
				if (spaceTop < tooltipRect.height && spaceBottom > tooltipRect.height) {
					return 'bottom';
				}
				break;
			case 'bottom':
				if (spaceBottom < tooltipRect.height && spaceTop > tooltipRect.height) {
					return 'top';
				}
				break;
			case 'left':
				if (spaceLeft < tooltipRect.width && spaceRight > tooltipRect.width) {
					return 'right';
				}
				break;
			case 'right':
				if (spaceRight < tooltipRect.width && spaceLeft > tooltipRect.width) {
					return 'left';
				}
				break;
		}

		return position;
	};

	/**
	 * Xử lý khi mouse enter
	 */
	const handleMouseEnter = () => {
		if (!enabled) return;

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			setIsVisible(true);
			onShow?.();
		}, delay);
	};

	/**
	 * Xử lý khi mouse leave
	 */
	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		setIsVisible(false);
		onHide?.();
	};

	/**
	 * Xử lý khi focus
	 */
	const handleFocus = () => {
		if (!enabled) return;
		setIsVisible(true);
		onShow?.();
	};

	/**
	 * Xử lý khi blur
	 */
	const handleBlur = () => {
		setIsVisible(false);
		onHide?.();
	};

	// Cập nhật vị trí khi tooltip hiển thị
	useEffect(() => {
		if (isVisible) {
			const optimalPosition = calculateOptimalPosition();
			setActualPosition(optimalPosition);
		}
	}, [isVisible, position, autoAdjust]);

	// Cleanup timeout khi component unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	if (!enabled) {
		return <>{children}</>;
	}

	const tooltipClasses = [
		styles.tooltip,
		styles[`tooltip--${actualPosition}`],
		styles[`tooltip--${size}`],
		showArrow ? styles['tooltip--with-arrow'] : '',
		className,
	]
		.filter(Boolean)
		.join(' ');

	const wrapperClasses = [styles.wrapper, wrapperClassName].filter(Boolean).join(' ');

	return (
		<div
			ref={wrapperRef}
			className={wrapperClasses}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
		>
			{children}
			{isVisible && (
				<div ref={tooltipRef} className={tooltipClasses} role='tooltip' aria-hidden={!isVisible}>
					<div className={styles.tooltip__content}>{content}</div>
					{showArrow && <div className={styles.tooltip__arrow} />}
				</div>
			)}
		</div>
	);
};

export default ToolTip;
