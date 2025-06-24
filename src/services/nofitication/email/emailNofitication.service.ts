import nodemailer from 'nodemailer';
import infoData from '@/data/info.json';
import { loggerService } from '../../logger.service';
import { readFileSync } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

export class EmailNofiticationService {
	private static instance: EmailNofiticationService;
	private SENDER_EMAIL = process.env.SENDER_EMAIL || '';
	private APP_PASSWORD = process.env.APP_PASSWORD || '';
	private __dirname = path.dirname(fileURLToPath(import.meta.url));
	private readonly innerTemplateFolderURL = path.join(this.__dirname, './templates');

	private constructor() {
		if (!this.SENDER_EMAIL || !this.APP_PASSWORD) {
			throw new Error('Vui lòng cấu hình SENDER_EMAIL và APP_PASSWORD trong biến môi trường.');
		}
	}

	static getInstance(): EmailNofiticationService {
		if (!EmailNofiticationService.instance) {
			EmailNofiticationService.instance = new EmailNofiticationService();
		}
		return EmailNofiticationService.instance;
	}

	private createTransporter(): nodemailer.Transporter {
		return nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: this.SENDER_EMAIL,
				pass: this.APP_PASSWORD,
			},
		});
	}

	private readTemplate(templateName: string): string {
		try {
			const templatePath = join(this.innerTemplateFolderURL, `${templateName}.html`);
			return readFileSync(templatePath, 'utf-8');
		} catch (error) {
			loggerService.error(`Lỗi khi đọc template ${templateName}:`, error);
			throw new Error(`Không thể đọc template ${templateName}`);
		}
	}

	private replaceTemplateVariables(template: string, variables: Record<string, string>): string {
		let result = template;
		Object.entries(variables).forEach(([key, value]) => {
			const placeholder = `{{${key}}}`;
			result = result.replace(new RegExp(placeholder, 'g'), value);
		});
		return result;
	}

	async sendEmailNotification(email: string, subject: string, html: string): Promise<void> {
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

	async sendVerifyEmail(email: string, token: string): Promise<void> {
		const verifyUrl = `${process.env.NEXT_PUBLIC_HOST}${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`;
		const expString = process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION || '5m';
		const template = this.readTemplate('verifyEmail');
		const html = this.replaceTemplateVariables(template, {
			verifyUrl,
			expString,
		});

		await this.sendEmailNotification(email, 'Xác thực email', html);
	}

	async sendResetPasswordEmail(email: string, token: string): Promise<void> {
		const resetUrl = `${process.env.NEXT_PUBLIC_HOST}${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${encodeURIComponent(token)}`;
		const expString = process.env.RESET_PASSWORD_TOKEN_EXPIRATION || '5m';
		const template = this.readTemplate('resetPassword');
		const html = this.replaceTemplateVariables(template, {
			resetUrl,
			expString,
		});

		await this.sendEmailNotification(email, 'Đặt lại mật khẩu', html);
	}
}
