enum LogLevel {
	INFO = 'info',
	ERROR = 'error',
	WARNING = 'warning',
	DEBUG = 'debug',
	SUCCESS = 'success',
	TRACE = 'trace',
	CRITICAL = 'critical',
}

const COLORS = {
	[LogLevel.INFO]: '\x1b[38;2;0;188;255m', // Neon cyan
	[LogLevel.ERROR]: '\x1b[38;2;255;51;51m', // Bright red
	[LogLevel.WARNING]: '\x1b[38;2;255;165;0m', // Bright orange
	[LogLevel.DEBUG]: '\x1b[38;2;178;102;255m', // Bright violet
	[LogLevel.SUCCESS]: '\x1b[38;2;0;255;128m', // Bright green
	[LogLevel.TRACE]: '\x1b[38;2;102;153;255m', // Sky blue
	[LogLevel.CRITICAL]: '\x1b[38;2;255;0;255m', // Magenta / hot pink
	RESET: '\x1b[0m',
};

class Logger {
	private readonly logable: boolean = true;
	private static instance: Logger;

	private constructor() {}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	private log(level: LogLevel, message: string, ...optionalParams: any[]) {
		if (!this.logable) return;
		const color = COLORS[level] || '';
		const reset = COLORS.RESET;
		const now = new Date();
		const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
		const timestamp = vietnamTime.toISOString().replace('T', ' ').replace('Z', '');
		const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
		const output = `${color}${prefix}${reset} ${message}`;
		switch (level) {
			case LogLevel.ERROR:
			case LogLevel.CRITICAL:
				console.error(output, ...optionalParams);
				break;
			case LogLevel.WARNING:
				console.warn(output, ...optionalParams);
				break;
			case LogLevel.DEBUG:
			case LogLevel.TRACE:
				console.debug(output, ...optionalParams);
				break;
			case LogLevel.SUCCESS:
			case LogLevel.INFO:
			default:
				console.log(output, ...optionalParams);
				break;
		}
	}

	info(message: string, ...optionalParams: any[]) {
		this.log(LogLevel.INFO, message, ...optionalParams);
	}

	error(message: string, ...optionalParams: any[]) {
		this.log(LogLevel.ERROR, message, ...optionalParams);
	}

	warning(message: string, ...optionalParams: any[]) {
		this.log(LogLevel.WARNING, message, ...optionalParams);
	}

	debug(message: string, ...optionalParams: any[]) {
		this.log(LogLevel.DEBUG, message, ...optionalParams);
	}

	success(message: string, ...optionalParams: any[]) {
		this.log(LogLevel.SUCCESS, message, ...optionalParams);
	}

	trace(message: string, ...optionalParams: any[]) {
		this.log(LogLevel.TRACE, message, ...optionalParams);
	}

	critical(message: string, ...optionalParams: any[]) {
		this.log(LogLevel.CRITICAL, message, ...optionalParams);
	}
}

export const loggerService = Logger.getInstance();
