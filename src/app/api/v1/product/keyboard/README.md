# Product API

Các API quản lý sản phẩm (bàn phím).

---

## Lấy danh sách bàn phím

-   **GET** `/api/v1/product/keyboard?page=1&limit=20`

**Response:**

```json
{
	"message": "Lấy danh sách bàn phím thành công",
	"data": {
		"keyboards": [
			{
				"id": "abc123",
				"name": "Bàn phím cơ"
				// ...
			}
		],
		"pagination": {
			"page": 1,
			"limit": 20,
			"total": 100
		}
	}
}
```

---

## Lấy chi tiết bàn phím

-   **GET** `/api/v1/product/keyboard/[id]`

**Response:**

```json
{
	"id": "abc123",
	"name": "Bàn phím cơ"
	// ...
}
```

---

## Tìm kiếm & lọc bàn phím

-   **POST** `/api/v1/product/keyboard/search-filter`

**Body:**

```json
{
	"keyword": "gaming",
	"criteria": { "brand": "Logitech" },
	"page": 1,
	"limit": 10,
	"sort": { "price": "asc" }
}
```

**Response:**

```json
{
	"keyboards": [
		{
			"id": "abc123",
			"name": "Bàn phím cơ"
			// ...
		}
	],
	"pagination": {
		"page": 1,
		"limit": 10,
		"total": 5
	}
}
```

---

## Lấy markdown chi tiết sản phẩm

-   **GET** `/api/v1/product/detail/markdown/[id]`

**Response:**

```json
{
	"productId": "abc123",
	"markdown": "# Thông tin chi tiết sản phẩm..."
}
```
