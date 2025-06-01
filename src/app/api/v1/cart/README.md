# Cart API

Quản lý giỏ hàng.

## Lấy giỏ hàng

**GET** `/api/v1/cart`

```json
{
	"cart": {
		"items": [
			{
				"productId": "abc123",
				"quantity": 2,
				"price": 100000,
				"name": "Product Name",
				"image": "url"
			}
		]
	}
}
```

## Thêm sản phẩm

**POST** `/api/v1/cart`

```json
{
	"productId": "abc123",
	"quantity": 1
}
```

**Response:**

```json
{ "message": "Thêm sản phẩm vào giỏ hàng thành công" }
```

## Cập nhật số lượng

**PUT** `/api/v1/cart`

```json
{
	"productId": "abc123",
	"quantity": 3
}
```

**Response:**

```json
{ "message": "Cập nhật giỏ hàng thành công" }
```

## Xóa sản phẩm

**DELETE** `/api/v1/cart?productId=abc123`

**Response:**

```json
{ "message": "Xóa sản phẩm khỏi giỏ hàng thành công" }
```

## Xóa toàn bộ

**DELETE** `/api/v1/cart`

**Response:**

```json
{ "message": "Xóa toàn bộ giỏ hàng thành công" }
```
