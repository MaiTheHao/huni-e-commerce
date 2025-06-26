/**
 * Làm tròn giá trị theo đơn vị chỉ định.
 * @param value Giá trị cần làm tròn
 * @param roundUnit Đơn vị làm tròn (ví dụ: 1000 cho VND, 1 cho USD)
 * @returns Giá trị đã làm tròn
 */
export function roundToUnit(value: number, roundUnit: number = 1000, alwaysCeil: boolean = false): number {
	const remainder = value % roundUnit;
	if (alwaysCeil || remainder >= roundUnit / 2) {
		return value - remainder + roundUnit;
	} else {
		return value - remainder;
	}
}

/**
 * Tính giá sau khi áp dụng phần trăm giảm giá.
 * @param originalPrice Giá gốc
 * @param discountPercent Phần trăm giảm giá
 * @param round Có làm tròn giá trị không
 * @param roundUnit Đơn vị làm tròn (mặc định: 1, ví dụ: 1000 cho VND, 1 cho USD)
 * @returns Giá sau khi giảm
 */
export function calcDiscountedPrice(originalPrice: number | null, discountPercent: number | null, round?: boolean, roundUnit: number = 1000): number {
	if (!originalPrice || !discountPercent) {
		return originalPrice || 0;
	}
	if (discountPercent <= 0 || discountPercent > 100) {
		return originalPrice;
	}
	let discountedPrice: number = originalPrice - (originalPrice * discountPercent) / 100;
	if (round) {
		discountedPrice = roundToUnit(discountedPrice, roundUnit, true);
	}
	return discountedPrice;
}

/**
 * Tính số tiền được giảm dựa trên giá gốc và phần trăm giảm giá.
 * @param originalPrice Giá gốc
 * @param discountPercent Phần trăm giảm giá
 * @param round Có làm tròn giá trị không
 * @param roundUnit Đơn vị làm tròn (mặc định: 1, ví dụ: 1000 cho VND, 1 cho USD)
 * @returns Số tiền giảm giá
 */
export function calcDiscountAmount(originalPrice: number | null, discountPercent: number | null, round?: boolean, roundUnit: number = 1000): number {
	const discountedPrice = calcDiscountedPrice(originalPrice, discountPercent, round, roundUnit);
	return (originalPrice || 0) - discountedPrice;
}

/**
 * Tính giá sau khi áp dụng VAT.
 * @param originalPrice Giá gốc
 * @param vatPercent Phần trăm VAT
 * @param round Có làm tròn giá trị không
 * @param roundUnit Đơn vị làm tròn (mặc định: 1, ví dụ: 1000 cho VND, 1 cho USD)
 * @returns Giá sau khi cộng VAT
 */
export function calcPriceWithVAT(originalPrice: number | null, vatPercent: number | null, round?: boolean, roundUnit: number = 1000): number {
	if (!originalPrice || !vatPercent || vatPercent <= 0) {
		return originalPrice || 0;
	}
	let priceWithVAT: number = originalPrice + (originalPrice * vatPercent) / 100;
	if (round) {
		priceWithVAT = roundToUnit(priceWithVAT, roundUnit, true);
	}
	return priceWithVAT;
}

/**
 * Tính số tiền VAT dựa trên giá gốc và phần trăm VAT.
 * @param originalPrice Giá gốc
 * @param vatPercent Phần trăm VAT
 * @param round Có làm tròn giá trị không
 * @param roundUnit Đơn vị làm tròn (mặc định: 1, ví dụ: 1000 cho VND, 1 cho USD)
 * @returns Số tiền VAT
 */
export function calcVATAmount(originalPrice: number | null, vatPercent: number | null, round?: boolean, roundUnit: number = 1000): number {
	const priceWithVAT = calcPriceWithVAT(originalPrice, vatPercent, round, roundUnit);
	return priceWithVAT - (originalPrice || 0);
}

/**
 * Định dạng giá thành chuỗi theo locale và currency.
 * @param price Giá trị số
 * @param locale Mã locale (mặc định: 'vi-VN')
 * @param currency Đơn vị tiền tệ (mặc định: 'VND')
 * @param fractionDigits Số chữ số thập phân (mặc định: 0)
 * @returns Chuỗi giá đã định dạng
 */
export function toLocalePrice(price: number, locale: string = 'vi-VN', currency: string = 'VND', fractionDigits: number = 0): string {
	price = price || 0;

	const roundedPrice = Number(price.toFixed(fractionDigits));

	return roundedPrice.toLocaleString(locale, {
		style: 'currency',
		currency: currency,
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	});
}
