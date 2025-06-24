import { NextRequest, NextResponse } from 'next/server';
export async function middleware(req: NextRequest) {
	const response = NextResponse.next();
	const { pathname } = req.nextUrl;

	// Set the headers for CORS
	let origin: string | string[] = process.env.ALLOWED_ORIGINS || '*';
	const allowedOrigins = Array.isArray(origin) ? origin.join(',') : origin;
	response.headers.set('Access-Control-Allow-Origin', allowedOrigins);
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	response.headers.set('Access-Control-Allow-Credentials', 'true');

	// Chuyển hướng sang home nếu đường dẫn là '/'
	if (pathname === '/') {
		return NextResponse.redirect(new URL('/home', req.url));
	}

	return response;
}

export const config = {
	matcher: ['/api/:path*', '/'],
};
