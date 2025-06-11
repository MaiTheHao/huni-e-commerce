# Hướng dẫn sử dụng GlobalSearchContextProvider

## 1. Import context và hook

```tsx
import { useGlobalSearchContext } from 'contexts/GlobalSearch/useGlobalSearchContext';
import GlobalSearchContextProvider from 'contexts/GlobalSearch/GlobalSearchContextProvider';
```

## 2. Bọc component bằng GlobalSearchContextProvider

Bạn nên bọc `GlobalSearchContextProvider` ở cấp cao nhất của ứng dụng (thường là trong `_app.tsx` hoặc component gốc):

```tsx
<GlobalSearchContextProvider>
	<App />
</GlobalSearchContextProvider>
```

## 3. Sử dụng context trong component

Sử dụng hook `useGlobalSearchContext` để truy cập và thao tác với trạng thái tìm kiếm toàn cục:

```tsx
const { keyword, setKeyword, page, setPage, limit, setLimit, result, isLoading, resetSearch } = useGlobalSearchContext();

// Ví dụ cập nhật từ khóa tìm kiếm:
setKeyword('giày thể thao');

// Đọc kết quả tìm kiếm:
console.log(result);

// Kiểm tra trạng thái loading:
if (isLoading) {
	// Hiển thị loading...
}
```

## 4. Chi tiết về GlobalSearchContextProvider

-   **keyword**: Từ khóa tìm kiếm hiện tại.
-   **setKeyword**: Hàm cập nhật từ khóa tìm kiếm.
-   **page**: Trang hiện tại của kết quả tìm kiếm.
-   **setPage**: Hàm cập nhật trang.
-   **limit**: Số lượng kết quả trên mỗi trang.
-   **setLimit**: Hàm cập nhật limit.
-   **result**: Kết quả tìm kiếm (bao gồm data và thông tin phân trang).
-   **isLoading**: Trạng thái đang tải dữ liệu.
-   **resetSearch**: Hàm reset trạng thái tìm kiếm.

### Lưu ý

-   Khi thay đổi `keyword`, kết quả tìm kiếm sẽ được reset và tải lại từ đầu.
-   Khi thay đổi `page` hoặc `limit`, context sẽ tự động gọi API để lấy dữ liệu mới.
-   Có thể sử dụng `resetSearch()` để xóa kết quả và trạng thái tìm kiếm hiện tại.
-   Provider sẽ tự động hủy các request cũ khi có request mới, tránh lỗi race condition.

## 5. Ví dụ sử dụng

```tsx
import { useGlobalSearchContext } from 'contexts/GlobalSearch/useGlobalSearchContext';

function SearchBox() {
	const { keyword, setKeyword, result, isLoading } = useGlobalSearchContext();

	return (
		<div>
			<input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder='Tìm kiếm sản phẩm...' />
			{isLoading && <span>Đang tìm kiếm...</span>}
			<ul>
				{result?.data.map((product) => (
					<li key={product.id}>{product.name}</li>
				))}
			</ul>
		</div>
	);
}
```
