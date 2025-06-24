import { z } from 'zod';

export const nameSchema = z
	.string()
	.min(1, 'Tên là bắt buộc')
	.max(120, 'Tên không được quá 120 ký tự')
	.refine((val) => val.trim().length > 0, 'Tên là bắt buộc');

export const emailSchema = z
	.string()
	.email('Email không hợp lệ')
	.min(1, 'Email là bắt buộc')
	.max(256, 'Email không được quá 256 ký tự')
	.refine((val) => val.trim().length > 0, 'Email là bắt buộc');

export const passwordSchema = z
	.string()
	.min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
	.max(128, 'Mật khẩu không được quá 128 ký tự')
	.refine((val) => val.trim().length > 0, 'Mật khẩu là bắt buộc');

export const phoneSchema = z
	.string()
	.min(9, 'Số điện thoại phải có ít nhất 9 số')
	.max(15, 'Số điện thoại không được vượt quá 15 số')
	.regex(/^(0|\+84)[0-9]{9,14}$/, 'Số điện thoại không hợp lệ')
	.refine((val) => val.trim().length > 0, 'Số điện thoại là bắt buộc');
