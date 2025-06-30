export const formatDateToVietnameseString = (date: Date) => {
	if (!date) return '';
	return new Date(date).toLocaleString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
};
