import { CUSTOM_EVENTS, LOCAL_STORAGE_KEYS } from '@/consts/keys';
import { dispatchAuthEvent } from '@/util/custom-event.util';
import axios, { AxiosError } from 'axios';
import { loggerService } from '@/services/logger.service';
import { IResponse } from '@/interfaces';

// info Biến kiểm soát trạng thái refresh token
let isRefreshing = false;
// info Hàng đợi các request khi đang refresh token
let requestQueue: { resolve: Function; reject: Function; reqConfig: any }[] = [];
// info Các path không cần kiểm tra token
const EXCLUDED_PATHS = ['refresh-token', 'logout', 'signin', 'signup', 'oauth'];

// info Kiểm tra xem URL có nằm trong danh sách loại trừ không
const isExcluded = (url: string | undefined) => {
	return EXCLUDED_PATHS.some((path) => url?.includes(path));
};

// info Xử lý hàng đợi request khi refresh token xong
const processQueue = (error: any = null, token: string | null = null) => {
	requestQueue.forEach(({ resolve, reject, reqConfig }) => {
		if (error) {
			// error Xử lý lỗi cho các request trong hàng đợi
			loggerService.error('Lỗi khi xử lý hàng đợi request sau refresh token', error);
			reject(error);
		} else {
			if (token) {
				reqConfig.headers.Authorization = `Bearer ${token}`;
			}
			resolve(api(reqConfig));
		}
	});
	requestQueue = [];
};

// info Khởi tạo instance axios
const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_HOST}${process.env.NEXT_PUBLIC_API_URL}` || `${process.env.NEXT_PUBLIC_HOST}/api/v1`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000,
});

// info UTILS
const linkResponseErrorMessage = (error: AxiosError<IResponse>) => {
	if (error && error.response && error.response.data && error.response.data.message) {
		error.message = error.response.data.message;
	}
};

// info Interceptor cho request: thêm access token nếu có
api.interceptors.request.use((config) => {
	const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
	if (isExcluded(config.url)) return config;
	if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
	return config;
});

// info Interceptor cho response: xử lý lỗi 401 và refresh token
api.interceptors.response.use(
	(res) => {
		return res;
	},
	async (err) => {
		const reqConfig = err.config;
		const response = err.response;
		const statusCode = response ? response.status : null;
		// error Xử lý lỗi 401 - hết hạn access token
		if (statusCode === 401 && !isExcluded(reqConfig.url)) {
			if (isRefreshing) {
				// debug Đang refresh token, đưa request vào hàng đợi
				return new Promise((resolve, reject) => {
					requestQueue.push({ resolve, reject, reqConfig });
				});
			}
			isRefreshing = true;
			try {
				const { data } = await api.post('/auth/refresh-token', {}, { withCredentials: true });
				const newAccessToken = data?.data?.accessToken;
				if (!newAccessToken) {
					// error Không lấy được access token mới, đăng xuất
					loggerService.error('Không lấy được access token mới khi refresh token');
					linkResponseErrorMessage(err);
					processQueue(err, null);
					dispatchAuthEvent(CUSTOM_EVENTS.LOGOUT);
					localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
					return Promise.reject(err);
				}
				localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
				dispatchAuthEvent(CUSTOM_EVENTS.TOKEN_REFRESHED, { accessToken: newAccessToken });
				processQueue(null, newAccessToken);
				reqConfig.headers.Authorization = `Bearer ${newAccessToken}`;
				return api(reqConfig);
			} catch (refreshError: any) {
				// error Refresh token thất bại, đăng xuất
				loggerService.error('Refresh token thất bại', refreshError);
				dispatchAuthEvent(CUSTOM_EVENTS.LOGOUT);
				processQueue(refreshError, null);
				linkResponseErrorMessage(err);
				return Promise.reject(err);
			} finally {
				isRefreshing = false;
			}
		}
		// error Lỗi response khác
		if (statusCode && statusCode >= 400) {
			loggerService.error(`Lỗi response từ server: ${statusCode}`, err);
		}
		return Promise.reject(err);
	}
);

export default api;
