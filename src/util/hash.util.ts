import * as crypto from 'crypto';

export function generateSalt(length: number = 16): Buffer {
	if (length <= 0) {
		throw new Error('Chỉ số độ dài phải lớn hơn 0');
	}
	return crypto.randomBytes(length);
}

export function hashPassword(password: string, salt: Buffer): string {
	if (!password || !salt) {
		throw new Error('Mật khẩu và salt là bắt buộc');
	}
	const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512');
	return hash.toString('hex');
}

export function comparePassword(password: string, salt: Buffer, hashedPassword: string): boolean {
	if (!password || !salt || !hashedPassword) {
		return false;
	}

	const hash = hashPassword(password, salt);
	const hashBuffer = Buffer.from(hash, 'hex');
	const hashedPasswordBuffer = Buffer.from(hashedPassword, 'hex');

	if (hashBuffer.length !== hashedPasswordBuffer.length) {
		return false;
	}

	return crypto.timingSafeEqual(hashBuffer, hashedPasswordBuffer);
}
