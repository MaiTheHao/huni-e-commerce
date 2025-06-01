import { NextRequest, NextResponse } from 'next/server';
import { loggerService } from './services/logger.service';

export function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const { pathname, search } = request.nextUrl;
	const method = request.method;

	loggerService.debug('MIDDLEWARE TRIGGER: ', {
		'Đường dẫn': pathname,
		'Tìm kiếm': search,
		'Phương thức': method,
	});

	return response;
}

export const config = {
	matcher: '/api/:path*',
};
