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
