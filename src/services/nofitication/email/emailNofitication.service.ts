import nodemailer from 'nodemailer';
import infoData from '@/data/info.json';
import { loggerService } from '../../logger.service';
import template from './template.json';

export class EmailNofiticationService {
	private static instance: EmailNofiticationService;
	private SENDER_EMAIL = process.env.SENDER_EMAIL || '';
	private APP_PASSWORD = process.env.APP_PASSWORD || '';

	private constructor() {
		if (!this.SENDER_EMAIL || !this.APP_PASSWORD) {
			throw new Error('Vui lòng cấu hình SENDER_EMAIL và APP_PASSWORD trong biến môi trường.');
		}
	}

	public static getInstance(): EmailNofiticationService {
		if (!EmailNofiticationService.instance) {
			EmailNofiticationService.instance = new EmailNofiticationService();
		}
		return EmailNofiticationService.instance;
	}

	// Tạo một hàm riêng để tạo transporter mới cho mỗi lần gửi email
	// (Trong môi trường serverless như Vercel, mỗi hàm có thể chạy trên một instance riêng biệt,
	// nên việc tạo mới transporter cho mỗi lần gửi sẽ đảm bảo kết nối luôn hoạt động)
	private createTransporter(): nodemailer.Transporter {
		return nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: this.SENDER_EMAIL,
				pass: this.APP_PASSWORD,
			},
		});
	}

	public async sendEmailNotification(email: string, subject: string, html: string): Promise<void> {
		// Tạo transporter mới cho mỗi lần gửi email để tránh các vấn đề về connection timeout
		// trong môi trường serverless
		const transporter = this.createTransporter();

		try {
			await transporter.sendMail({
				from: `${infoData.shopName} <${this.SENDER_EMAIL}>`,
				to: email,
				subject: subject,
				html: html,
			});
			loggerService.info(`Gửi email thành công tới ${email} với tiêu đề: ${subject}`);
		} catch (error) {
			loggerService.error('Lỗi khi gửi email:', error);
		}
	}

	public async sendVerifyEmail(email: string, token: string): Promise<void> {
		const template = await import('./template.json');
		const verifyUrl = `${process.env.NEXT_PUBLIC_HOST}${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`;
		const html = template.verifyEmail.replace('{{verifyUrl}}', verifyUrl);
		await this.sendEmailNotification(email, 'Xác thực email', html);
	}

	public getVerifySuccessHtml(): string {
		return template.verifySuccess;
	}

	public getVerifyErrorHtml(): string {
		return template.verifyError;
	}

	public getAlreadyVerifiedHtml(): string {
		return template.alreadyVerified;
	}
}
