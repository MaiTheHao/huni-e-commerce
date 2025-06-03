import { NextRequest, NextResponse } from 'next/server';
import { loggerService } from './services/logger.service';

export function middleware(request: NextRequest) {
	const response = NextResponse.next();
	const { pathname, search } = request.nextUrl;
	const method = request.method;

	// Log the request details
	loggerService.debug('MIDDLEWARE TRIGGER: ', {
		'Đường dẫn': pathname,
		'Tìm kiếm': search,
		'Phương thức': method,
	});

	// Set the headers for CORS
	let origin: string | string[] = process.env.ALLOWED_ORIGINS || '*';
	const allowedOrigins = Array.isArray(origin) ? origin.join(',') : origin;
	response.headers.set('Access-Control-Allow-Origin', allowedOrigins);
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	response.headers.set('Access-Control-Allow-Credentials', 'true');

	// Chuyển hướng sang home nếu đường dẫn là '/'
	if (pathname === '/') {
		loggerService.debug('Chuyển hướng đến trang chủ');
		return NextResponse.redirect(new URL('/home', request.url));
	}

	return response;
}

export const config = {
	matcher: ['/api/:path*', '/'],
};
