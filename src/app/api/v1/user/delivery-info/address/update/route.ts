import { IUpdateDeliveryAddressesRequestData, IUpdateDeliveryAddressesResponseData } from '@/interfaces/api/user/update-delivery-addresses.interface';
import { authService } from '@/services/auth/auth.service';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { isEmpty, toString } from '@/util';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
	// Lấy token từ header để xác thực người dùng
	const [error, token] = authService.extractBearerToken(req);
	if (error || !token) {
		loggerService.error('Authorization không hợp lệ', error);
		return responseService.unauthorized('Không được phép truy cập');
	}

	// Xác thực access token
	const [verifyError, decoded] = await tokenService.verifyAccessToken(token);
	if (verifyError || !decoded) {
		loggerService.error(`Xác thực access token thất bại ${verifyError}`);
		return responseService.unauthorized('Không được phép truy cập');
	}

	try {
		const body: IUpdateDeliveryAddressesRequestData = await req.json();
		const addresses = body.addresses;

		if (isEmpty(addresses)) {
			return responseService.error('Thiếu thông tin địa chỉ', 400);
		}

		// Chỉ cập nhật trường addresses
		const [updateError, user] = await userService.updateProfile(decoded.uid, {
			addresses,
		});

		if (updateError) {
			loggerService.error('Lỗi khi cập nhật địa chỉ người dùng:', updateError);
			return responseService.error('Không thể cập nhật địa chỉ người dùng', 500, updateError);
		}

		if (!user) {
			loggerService.error('Không tìm thấy người dùng với ID', decoded.uid);
			return responseService.notFound('Không tìm thấy người dùng');
		}

		// success Cập nhật địa chỉ thành công
		const responseData: IUpdateDeliveryAddressesResponseData = {
			uid: toString(user._id),
			name: user.name,
			email: user.email,
			phone: user.phone,
			addresses: user.addresses || [],
		};

		return responseService.success(responseData, 'Cập nhật địa chỉ thành công');
	} catch (err) {
		loggerService.error('Lỗi khi cập nhật địa chỉ của người dùng:', err);
		return responseService.error('Không thể cập nhật địa chỉ', 500, err);
	}
}
