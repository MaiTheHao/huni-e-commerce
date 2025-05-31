import { useRef, useState } from 'react';

type UseMobileScrollXResult = {
	isSwiping: boolean;
	direction: 'left' | 'right' | null;
	distance: number;
	handleTouchStart: (e: React.TouchEvent) => void;
	handleTouchMove: (e: React.TouchEvent) => void;
	handleTouchEnd: (e: React.TouchEvent) => void;
	reset: () => void;
};

/**
 * Hook React tùy chỉnh để xử lý thao tác vuốt ngang (trái/phải) trên thiết bị di động.
 *
 * @param minSwipeDistance - Khoảng cách tối thiểu (tính bằng pixel) để xác định một thao tác vuốt hợp lệ. Mặc định là 50.
 * @returns Một object bao gồm:
 * - `isSwiping`: Xác định xem thao tác vuốt hiện tại có đang diễn ra hay không.
 * - `direction`: Hướng vuốt ('left', 'right', hoặc null nếu không phát hiện vuốt).
 * - `distance`: Khoảng cách (pixel) ngón tay đã di chuyển theo phương ngang kể từ khi bắt đầu thao tác.
 * - `handleTouchStart`: Hàm xử lý sự kiện, gắn vào `onTouchStart` của component.
 * - `handleTouchMove`: Hàm xử lý sự kiện, gắn vào `onTouchMove` của component.
 * - `handleTouchEnd`: Hàm xử lý sự kiện, gắn vào `onTouchEnd` của component.
 * - `reset`: Hàm để reset trạng thái vuốt thủ công.
 *
 * @example
 * ```tsx
 * const {
 *   isSwiping,
 *   direction,
 *   distance,
 *   handleTouchStart,
 *   handleTouchMove,
 *   handleTouchEnd,
 *   reset,
 * } = useMobileScrollX();
 *
 * <div
 *   onTouchStart={handleTouchStart}
 *   onTouchMove={handleTouchMove}
 *   onTouchEnd={handleTouchEnd}
 * >
 * CONTENT HERE
 * </div>
 * ```
 *
 * @remarks
 * - Hook này hữu ích khi cần triển khai các thao tác điều hướng hoặc hành động dựa trên vuốt trong ứng dụng web di động.
 * - Component cha có thể sử dụng giá trị `direction` và `distance` trong callback `handleTouchEnd` để xác định có nên thực hiện hành động vuốt hay không.
 * - Gọi `reset` để xóa trạng thái vuốt nếu cần (ví dụ: sau khi xử lý xong thao tác vuốt).
 */

export function useMobileScrollX(minSwipeDistance = 50): UseMobileScrollXResult {
	const [isSwiping, setIsSwiping] = useState(false);
	const [direction, setDirection] = useState<'left' | 'right' | null>(null);
	const [distance, setDistance] = useState(0);

	const touchStartX = useRef<number | null>(null);

	const handleTouchStart = (e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
		setIsSwiping(false);
		setDirection(null);
		setDistance(0);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (touchStartX.current === null) return;
		const currentX = e.touches[0].clientX;
		const diff = currentX - touchStartX.current;
		setDistance(diff);
		setIsSwiping(true);
		setDirection(diff < 0 ? 'left' : diff > 0 ? 'right' : null);
	};

	const handleTouchEnd = () => {
		if (Math.abs(distance) < minSwipeDistance) {
			setIsSwiping(false);
			setDirection(null);
			setDistance(0);
		}
		// Nếu muốn, component cha sẽ xử lý swipe ở đây dựa vào direction và distance
	};

	const reset = () => {
		setIsSwiping(false);
		setDirection(null);
		setDistance(0);
		touchStartX.current = null;
	};

	return {
		isSwiping,
		direction,
		distance,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
		reset,
	};
}
