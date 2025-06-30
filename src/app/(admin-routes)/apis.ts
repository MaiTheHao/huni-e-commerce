import api from '@/services/http-client/axios-interceptor';

// info Hàm kiểm tra xem người dùng có phải là quản trị viên hợp lệ hay không
export async function fetchIsValidAdmin(): Promise<boolean> {
	try {
		const response = await api.get('/admin/valid');
		if (response.status !== 200) return false;
		return true;
	} catch (error) {
		return false;
	}
}
