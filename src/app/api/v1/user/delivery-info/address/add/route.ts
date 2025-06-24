import { userRepository } from '@/server/repositories/user.repository';
import { authService } from '@/services/auth/auth.service';
import { userService } from '@/services/entity/user.service';
import { loggerService } from '@/services/logger.service';
import { responseService } from '@/services/response.service';
import { tokenService } from '@/services/token.service';
import { toString } from '@/util';
import { NextRequest } from 'next/server';
import { IAddDeliveryAddressRequestData, IAddDeliveryAddressResponseData } from '@/interfaces/api/user/add-delivery-address.interface';

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
		// Lấy địa chỉ mới từ request body (theo interface)
		const body: IAddDeliveryAddressRequestData = await req.json();

		// Lấy thông tin user từ DB
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

		// Thêm địa chỉ mới vào mảng addresses
		const updatedAddresses = [...(user.addresses || []), body.address];

		// Cập nhật lại addresses lên DB
		const [updateError, updatedUser] = await userService.updateProfile(decoded.uid, {
			addresses: updatedAddresses,
		});

		if (updateError) {
			loggerService.error('Lỗi khi thêm địa chỉ giao hàng:', updateError);
			return responseService.error('Không thể thêm địa chỉ giao hàng', 500, updateError);
		}

		if (!updatedUser) {
			loggerService.error('Không tìm thấy người dùng với ID', decoded.uid);
			return responseService.notFound('Không tìm thấy người dùng');
		}

		// Trả về thông tin giao hàng mới (theo interface)
		const responseData: IAddDeliveryAddressResponseData = {
			uid: toString(updatedUser._id),
			name: updatedUser.name,
			email: updatedUser.email,
			phone: updatedUser.phone,
			addresses: updatedUser.addresses || [],
		};

		return responseService.success(responseData, 'Thêm địa chỉ giao hàng thành công');
	} catch (err) {
		loggerService.error('Lỗi khi thêm địa chỉ giao hàng:', err);
		return responseService.error('Không thể thêm địa chỉ giao hàng', 500, err);
	}
}
