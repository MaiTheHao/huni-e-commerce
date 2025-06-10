/**
 * Tính giá sau khi áp dụng phần trăm giảm giá.
 * @param originalPrice Giá gốc
 * @param discountPercent Phần trăm giảm giá
 * @param round Có làm tròn giá trị không
 * @returns Giá sau khi giảm
 */
export function calcDiscountPrice(originalPrice: number, discountPercent: number, round?: boolean): number {
	let discountedPrice: number = 0;
	discountedPrice = originalPrice - (originalPrice * discountPercent) / 100;
	return round ? Math.round(discountedPrice) : discountedPrice;
}

/**
 * Định dạng giá thành chuỗi theo locale và currency.
 * @param price Giá trị số
 * @param locale Mã locale (mặc định: 'vi-VN')
 * @param currency Đơn vị tiền tệ (mặc định: 'VND')
 * @param fractionDigits Số chữ số thập phân (mặc định: 0)
 * @returns Chuỗi giá đã định dạng
 */
export function toLocalePrice(
	price: number,
	locale: string = 'vi-VN',
	currency: string = 'VND',
	fractionDigits: number = 0
): string {
	price = price || 0;

	const roundedPrice = Number(price.toFixed(fractionDigits));

	return roundedPrice.toLocaleString(locale, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
}
