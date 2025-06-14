import { EmailNofiticationService } from './email/emailNofitication.service';
const NofiticationTypes = ['email'] as const;
type TNofiticationType = (typeof NofiticationTypes)[number];

class NofiticationService {
	private static instance: NofiticationService;
	private constructor() {}
	public static getInstance(): NofiticationService {
		if (!NofiticationService.instance) {
			NofiticationService.instance = new NofiticationService();
		}
		return NofiticationService.instance;
	}

	getNofiticationService(type: TNofiticationType): any {
		switch (type) {
			case 'email':
				return this.getEmailNofiticationService();
			default:
				throw new Error(`Unsupported notification type: ${type}`);
		}
	}

	getEmailNofiticationService(): EmailNofiticationService {
		return EmailNofiticationService.getInstance();
	}
}

export const nofiticationService = NofiticationService.getInstance();
