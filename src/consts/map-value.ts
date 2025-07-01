import { TOrderPaymentMethod, TOrderStatus, TOrderType } from '../interfaces/entity/order/order.entity';

export const LOCAL_STORAGE_KEYS_MAP = {
	VERIFY_EMAIL_COUNTDOWN: 'verify_email_countdown_iat',
	ACCESS_TOKEN: 'accessToken',
	USER_DATA: 'user_data',
	LAST_PROFILE_FETCH: 'last_profile_fetch',
	LAST_STANDING_URL: 'last_standing_url',
};

export const COOKIE_KEYS_MAP = {
	OAUTH_STATE: 'oauth_state',
	ACCESS_TOKEN: 'access_token',
	REFRESH_TOKEN: 'refresh_token',
	TMP_ACCESS_TOKEN: 'tmp_access_token',
};

export const CUSTOM_EVENTS_MAP = {
	TOKEN_REFRESHED: 'token-refreshed',
	LOGOUT: 'logout',
};

export const ORDER_STATUS_TEXT_MAP: Record<TOrderStatus, string> = {
	pending: 'Chờ xác nhận',
	confirmed: 'Đã xác nhận',
	shipped: 'Đang giao hàng',
	delivered: 'Đã nhận hàng',
	cancelled: 'Đã hủy',
};

export const ORDER_TYPE_TEXT_MAP: Record<TOrderType, string> = {
	normal: 'Đơn hàng thường',
	anonymous: 'Đơn hàng ẩn danh',
};

export const PAYMENT_METHOD_TEXT_MAP: Record<TOrderPaymentMethod, string> = {
	cod: 'Thanh toán khi nhận hàng (COD)',
	bank: 'Chuyển khoản ngân hàng',
	cash: 'Thanh toán trực tiếp tại cửa hàng',
};
