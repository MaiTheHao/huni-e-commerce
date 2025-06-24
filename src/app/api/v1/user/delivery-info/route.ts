import { userRepository } from '@/server/repositories/user.repository';
import { authService } from '@/services/auth/auth.service';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { toString } from '@/util';
import { NextRequest } from 'next/server';
import { IGetDeliveryInfoResponseData } from '@/interfaces/api/user/get-delivery-info.interface';
import { IUpdateDeliveryInfoRequestData } from '@/interfaces/api/user/update-delivery-info.interface';

export async function GET(req: NextRequest) {
	// info Lấy token từ header để xác thực người dùng
	const [error, token] = authService.extractBearerToken(req);
	if (error || !token) {
		// error Không có token hoặc token không hợp lệ
		loggerService.error('Authorization không hợp lệ', error);
		return responseService.unauthorized('Không được phép truy cập');
	}

	// info Xác thực access token
	const [verifyError, decoded] = await tokenService.verifyAccessToken(token);
	if (verifyError || !decoded) {
		loggerService.error(`Xác thực access token thất bại ${verifyError}`);
		return responseService.unauthorized('Không được phép truy cập');
	}

	try {
		const user = await userRepository.findById(decoded.uid, {
			name: 1,
			email: 1,
			phone: 1,
			addresses: 1,
		});

		if (!user) {
			loggerService.error('Không tìm thấy người dùng với ID', decoded.uid);
			return responseService.notFound('Không tìm thấy người dùng');
		}

		// success Trả về thông tin giao hàng thành công
		const responseData: IGetDeliveryInfoResponseData = {
			uid: toString(user._id),
			name: user.name,
			email: user.email,
			phone: user.phone,
			addresses: user.addresses || [],
		};

		return responseService.success(responseData, 'Lấy thông tin giao hàng thành công');
	} catch (err) {
		loggerService.error('Lỗi khi truy vấn thông tin giao hàng của người dùng:', err);
		return responseService.error('Không thể lấy thông tin giao hàng', 500, err);
	}
}

export async function POST(req: NextRequest) {
	// info Lấy token từ header để xác thực người dùng
	const [error, token] = authService.extractBearerToken(req);
	if (error || !token) {
		// error Không có token hoặc token không hợp lệ
		loggerService.error('Authorization không hợp lệ', error);
		return responseService.unauthorized('Không được phép truy cập');
	}

	// info Xác thực access token
	const [verifyError, decoded] = await tokenService.verifyAccessToken(token);
	if (verifyError || !decoded) {
		loggerService.error(`Xác thực access token thất bại ${verifyError}`);
		return responseService.unauthorized('Không được phép truy cập');
	}

	try {
		const body = await req.json();
		const reqData: IUpdateDeliveryInfoRequestData = body;

		const [error, user] = await userService.updateProfile(decoded.uid, reqData);

		if (error) {
			loggerService.error('Lỗi khi cập nhật thông tin người dùng:', error);
			return responseService.error('Không thể cập nhật thông tin người dùng', 500, error);
		}

		if (!user) {
			loggerService.error('Không tìm thấy người dùng với ID', decoded.uid);
			return responseService.notFound('Không tìm thấy người dùng');
		}

		// success Cập nhật thông tin giao hàng thành công
		const responseData: IGetDeliveryInfoResponseData = {
			uid: toString(user._id),
			name: user.name,
			email: user.email,
			phone: user.phone,
			addresses: user.addresses || [],
		};

		return responseService.success(responseData, 'Cập nhật thông tin giao hàng thành công');
	} catch (err) {
		loggerService.error('Lỗi khi cập nhật thông tin giao hàng của người dùng:', err);
		return responseService.error('Không thể cập nhật thông tin giao hàng', 500, err);
	}
}
