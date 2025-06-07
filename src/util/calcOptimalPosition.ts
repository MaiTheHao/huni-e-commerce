import React from 'react';

type Positions = 'top' | 'bottom' | 'left' | 'right';

export function calcOptimalPosition(
	wrapperRef: React.RefObject<HTMLElement | null>,
	tooltipRef: React.RefObject<HTMLElement | null>,
	position: Positions,
	percentage: number = 0.1
): Positions {
	if (!wrapperRef.current || !tooltipRef.current) return 'top';
	const wrapperRect = wrapperRef.current.getBoundingClientRect();
	const tooltipRect = tooltipRef.current.getBoundingClientRect();
	const viewport = {
		width: window.innerWidth,
		height: window.innerHeight,
	};

	const spaceTop = wrapperRect.top - tooltipRect.height * percentage;
	const spaceBottom = viewport.height - wrapperRect.bottom - tooltipRect.height * percentage;
	const spaceLeft = wrapperRect.left - tooltipRect.width * percentage;
	const spaceRight = viewport.width - wrapperRect.right - tooltipRect.width * percentage;

	// Kiểm tra không gian theo từng hướng
	switch (position) {
		case 'top':
			if (spaceTop < tooltipRect.height && spaceBottom > spaceTop) {
				return 'bottom';
			}
			break;
		case 'bottom':
			if (spaceBottom < tooltipRect.height && spaceTop > spaceBottom) {
				return 'top';
			}
			break;
		case 'left':
			if (spaceLeft < tooltipRect.width && spaceRight > spaceLeft) {
				return 'right';
			}
			break;
		case 'right':
			if (spaceRight < tooltipRect.width && spaceLeft > spaceRight) {
				return 'left';
			}
			break;
	}

	return position;
}
