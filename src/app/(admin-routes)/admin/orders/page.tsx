import React from 'react';

/**
 * Trang quản lý đơn hàng dành cho admin.
 *
 * # Các phần cần có của một trang Quản lý Order cho admin:
 *
 * 1. **Danh sách đơn hàng**: Hiển thị bảng danh sách các đơn hàng đã được tạo, bao gồm các thông tin như mã đơn hàng, tên khách hàng, số điện thoại, địa chỉ giao hàng, trạng thái đơn hàng, ngày tạo đơn, v.v.
 * 2. **Tìm kiếm & lọc**: Cho phép admin tìm kiếm đơn hàng theo mã đơn, tên khách hàng, số điện thoại hoặc lọc theo trạng thái đơn hàng (chờ xác nhận, đã xác nhận, đang giao, đã hoàn thành, đã hủy...).
 * 3. **Xem chi tiết đơn hàng**: Khi click vào một đơn hàng, hiển thị chi tiết các sản phẩm trong đơn, số lượng, giá, thông tin khách hàng, ghi chú, lịch sử xử lý đơn hàng.
 * 4. **Cập nhật trạng thái đơn hàng**: Cho phép admin thay đổi trạng thái đơn hàng (xác nhận, giao hàng, hoàn thành, hủy đơn, v.v.) và ghi chú lý do nếu cần.
 * 5. **Xuất dữ liệu**: Hỗ trợ xuất danh sách đơn hàng ra file Excel hoặc CSV để quản lý offline.
 * 6. **Phân trang**: Nếu số lượng đơn hàng lớn, cần có chức năng phân trang hoặc tải thêm (load more).
 * 7. **Thông báo**: Hiển thị thông báo khi có đơn hàng mới hoặc khi cập nhật trạng thái thành công/thất bại.
 *
 * Lưu ý: Trang này dành cho web chuyên lên đơn không thanh toán online, nên không cần quản lý trạng thái thanh toán, chỉ tập trung vào quy trình xử lý đơn hàng và giao hàng.
 */
function AdminOrdersPage() {
	return <div>AdminOrdersPage</div>;
}

export default AdminOrdersPage;
