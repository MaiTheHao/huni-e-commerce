import nodemailer from 'nodemailer';
import infoData from '@/data/info.json';
import { loggerService } from '../../logger.service';
import template from './template.json';

export class EmailNofiticationService {
	private static instance: EmailNofiticationService;
	private transporter: nodemailer.Transporter;
	private SENDER_EMAIL = process.env.SENDER_EMAIL || '';
	private APP_PASSWORD = process.env.APP_PASSWORD || '';

	private constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: this.SENDER_EMAIL,
				pass: this.APP_PASSWORD,
			},
		});
	}

	public static getInstance(): EmailNofiticationService {
		if (!EmailNofiticationService.instance) {
			EmailNofiticationService.instance = new EmailNofiticationService();
		}
		return EmailNofiticationService.instance;
	}

	public async sendEmailNotification(email: string, subject: string, html: string): Promise<void> {
		try {
			this.transporter.sendMail({
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
