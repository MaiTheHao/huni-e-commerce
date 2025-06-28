'use client';
import api from '@/services/http-client/axios-interceptor';
import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { AuthContext, IAuthContextUser } from './AuthContext';
import { CUSTOM_EVENTS_MAP, LOCAL_STORAGE_KEYS_MAP } from '@/consts/map-value';
import { loggerService } from '@/services/logger.service';
import { tokenService } from '@/services/token.service';
import { IResponse } from '@/interfaces';
import { IGetProfileResponse } from '@/interfaces/api/user/get-profile.interface';
import Swal from 'sweetalert2';

const CACHE_DURATION = 5 * 60 * 1000; // milisecond
type AuthContextProviderProps = {
	children: React.ReactNode;
};

function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [user, setUser] = useState<IAuthContextUser | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// info Hàm lấy thông tin người dùng từ API hoặc localStorage
	const fetchUserProfile = useCallback(async (forceRefresh = false) => {
		const lastFetchTime = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS_MAP.LAST_PROFILE_FETCH) || '0');
		const now = Date.now();
		const milisecondsSinceLastFetch = now - lastFetchTime;

		// note Kiểm tra xem có cần làm mới dữ liệu người dùng không
		// note Điều kiện là nếu forceRefresh là true hoặc thời gian trôi qua chưa đủ CACHE_DURATION phút
		if (!forceRefresh && milisecondsSinceLastFetch < CACHE_DURATION) {
			const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS_MAP.USER_DATA);
			const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS_MAP.ACCESS_TOKEN);
			const [decodeError, decodedUser] = tokenService.decodeAccessToken(accessToken || '');

			if (storedUser && !decodeError) {
				try {
					const parsedUser: IAuthContextUser = JSON.parse(storedUser);

					if (!(decodedUser && decodedUser.uid === parsedUser.uid)) throw new Error('Dữ liệu người dùng không hợp lệ');

					setUser(parsedUser);
					setIsAuthenticated(true);
					setIsLoading(false);
					return;
				} catch (error) {
					// error Lỗi khi parse dữ liệu user từ localStorage
					loggerService.error('Lỗi trong quá trình đọc dữ liệu từ Local Storage:', error);
				}
			}
		}

		// note Gọi API để lấy thông tin người dùng
		setIsLoading(true);
		try {
			const response = await api.get('/user');
			const data: IResponse<IGetProfileResponse> = response.data;
			const userData = data.data;

			// error Không lấy được dữ liệu user từ API
			if (data.error || !userData) {
				loggerService.error('Lấy dữ liệu người dùng thất bại:', data.message);
				setIsAuthenticated(false);
				setUser(null);
				return;
			}

			const user: IAuthContextUser = { ...userData };

			// success Lấy user profile thành công, cập nhật localStorage
			setUser(user);
			setIsAuthenticated(true);
			localStorage.setItem(LOCAL_STORAGE_KEYS_MAP.USER_DATA, JSON.stringify(user));
			localStorage.setItem(LOCAL_STORAGE_KEYS_MAP.LAST_PROFILE_FETCH, Date.now().toString());
		} catch (error) {
			// error Lỗi khi gọi API lấy user profile
			loggerService.error('Lỗi khi gọi API lấy dữ liệu người dùng:', error);
			localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.USER_DATA);
			localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.ACCESS_TOKEN);
			localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.LAST_PROFILE_FETCH);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// info Hàm đăng nhập người dùng bằng access token
	const login = useCallback(
		(accessToken: string) => {
			const [error, decodedUser] = tokenService.decodeAccessToken(accessToken);
			// error Không decode được access token
			if (error || !decodedUser) {
				loggerService.error('Không thể decode token:', error);
				localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.ACCESS_TOKEN);
				localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.USER_DATA);
				localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.LAST_PROFILE_FETCH);
				setIsAuthenticated(false);
				setUser(null);
				return;
			}
			localStorage.setItem(LOCAL_STORAGE_KEYS_MAP.ACCESS_TOKEN, accessToken);
			fetchUserProfile(true);
		},
		[fetchUserProfile]
	);

	// info Hàm đăng xuất người dùng
	const logout = useCallback(async (disableAlert: boolean = false) => {
		setIsLoading(true);
		localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.USER_DATA);
		localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.ACCESS_TOKEN);
		localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.LAST_PROFILE_FETCH);
		try {
			const response = await api.post('/auth/logout');
			// success Đăng xuất API thành công
			!disableAlert &&
				Swal.fire({
					icon: 'success',
					title: 'Đăng xuất thành công',
					text: 'Bạn đã đăng xuất khỏi hệ thống.',
					confirmButtonText: 'OK',
				});
			return response.status === 200;
		} catch (error) {
			// error Lỗi khi gọi API logout
			!disableAlert &&
				Swal.fire({
					icon: 'error',
					title: 'Đăng xuất không thành công',
					text: 'Đã xảy ra lỗi khi đăng xuất.',
					confirmButtonText: 'OK',
				});
			loggerService.error('Logout API error:', error);
			return false;
		} finally {
			setUser(null);
			setIsAuthenticated(false);
			setIsLoading(false);
		}
	}, []);

	// info Hàm cập nhật thông tin người dùng
	const updateUser = useCallback((updated: Partial<IAuthContextUser>) => {
		setUser((prev) => {
			if (!prev) return null;
			const merged = { ...prev, ...updated };
			localStorage.setItem(LOCAL_STORAGE_KEYS_MAP.USER_DATA, JSON.stringify(merged));
			localStorage.setItem(LOCAL_STORAGE_KEYS_MAP.LAST_PROFILE_FETCH, Date.now().toString());
			return merged;
		});
	}, []);

	// info Lấy thông tin người dùng khi component mount
	useEffect(() => {
		const accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS_MAP.ACCESS_TOKEN);
		// info Nếu không có access token, không cần gọi API
		if (!accessToken) {
			setIsLoading(false);
			setIsAuthenticated(false);
			loggerService.info('Không có access token, không cần gọi API lấy thông tin người dùng');
			return;
		}

		fetchUserProfile(true);
	}, [fetchUserProfile]);

	// info Lắng nghe sự kiện refresh/remove token
	useEffect(() => {
		// info Hàm xử lý sự kiện token được làm mới
		const handleTokenRefreshed = (event: Event) => {
			const customEvent = event as CustomEvent<{ accessToken: string }>;
			const newToken = customEvent.detail?.accessToken;
			if (newToken) {
				localStorage.removeItem(LOCAL_STORAGE_KEYS_MAP.LAST_PROFILE_FETCH);
				fetchUserProfile(true);
			}
		};

		// info Hàm xử lý sự kiện token bị xóa
		const handleTokenRemoved = async () => {
			setUser(null);
			setIsAuthenticated(false);
			const logoutSuccess = await logout(true);

			// fixme Cần cải thiện xử lý đăng xuất khi không có access token
			if (logoutSuccess) {
				loggerService.info('Đăng xuất thành công');
			} else {
				loggerService.error('Đăng xuất không thành công');
			}
		};

		// info Đăng ký lắng nghe sự kiện token-refreshed và logout
		window.addEventListener(CUSTOM_EVENTS_MAP.TOKEN_REFRESHED, handleTokenRefreshed as EventListener);
		window.addEventListener(CUSTOM_EVENTS_MAP.LOGOUT, handleTokenRemoved);

		return () => {
			window.removeEventListener(CUSTOM_EVENTS_MAP.TOKEN_REFRESHED, handleTokenRefreshed as EventListener);
			window.removeEventListener(CUSTOM_EVENTS_MAP.LOGOUT, handleTokenRemoved);
		};
	}, [fetchUserProfile]);

	const contextValue = useMemo(
		() => ({
			user,
			isAuthenticated,
			isLoading,
			login,
			logout,
			updateUser,
			refreshProfile: () => fetchUserProfile(true),
		}),
		[user, isAuthenticated, isLoading, login, logout, updateUser, fetchUserProfile]
	);

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export default memo(AuthContextProvider);
