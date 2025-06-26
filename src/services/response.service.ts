import { NextResponse } from 'next/server';
import { HTTPStatus } from '@/enums/HttpStatus.enum';
import { IResponse } from '@/interfaces';

class ResponseService {
	private static instance: ResponseService;

	private constructor() {}
	static getInstance(): ResponseService {
		if (!ResponseService.instance) {
			ResponseService.instance = new ResponseService();
		}
		return ResponseService.instance;
	}

	success<T>(data: T, message = 'Success', statusCode = HTTPStatus.OK) {
		const response: IResponse<T> = { message, data };
		return NextResponse.json(response, { status: statusCode });
	}

	created<T>(data?: T, message = 'Created successfully') {
		const response: IResponse<T> = { message, data };
		return NextResponse.json(response, { status: HTTPStatus.CREATED });
	}

	accepted<T>(data: T, message = 'Accepted') {
		const response: IResponse<T> = { message, data };
		return NextResponse.json(response, { status: HTTPStatus.ACCEPTED });
	}

	error(message = 'Error', statusCode = HTTPStatus.BAD_REQUEST, error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: statusCode });
	}

	badRequest(message = 'Bad request', error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: HTTPStatus.BAD_REQUEST });
	}

	unauthorized(message = 'Unauthorized', error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: HTTPStatus.UNAUTHORIZED });
	}

	notFound(message = 'Not found', error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: HTTPStatus.NOT_FOUND });
	}

	duplicated(message = 'Duplicated', error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: HTTPStatus.CONFLICT });
	}

	forbidden(message = 'Forbidden', error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: HTTPStatus.FORBIDDEN });
	}

	internalServerError(message = 'Internal server error', error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: HTTPStatus.INTERNAL_SERVER_ERROR });
	}

	alreadyChecked(message = 'Already checked', error?: any) {
		const response: IResponse = { message, error };
		return NextResponse.json(response, { status: HTTPStatus.BAD_REQUEST });
	}

	sendHtml(html: string, statusCode = HTTPStatus.OK) {
		return new Response(html, {
			status: statusCode,
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	}

	// Hàm này sẽ chuyển hướng đến một URL cụ thể
	redirect(url: string, statusCode = HTTPStatus.FOUND) {
		return NextResponse.redirect(url, {
			status: statusCode,
		});
	}

	// Hàm này sẽ chuyển hướng đến một URL cụ thể với base URL từ biến môi trường
	redirectClient(url: string, statusCode = HTTPStatus.FOUND) {
		return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}${url}`, {
			status: statusCode,
		});
	}
}

export const responseService = ResponseService.getInstance();
