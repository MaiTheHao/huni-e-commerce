export function calcDiscountPrice(originalPrice: number, discountPercent: number, round?: boolean): number {
	let discountedPrice: number = 0;
	discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;
	return round ? Math.round(discountedPrice) : discountedPrice;
}
