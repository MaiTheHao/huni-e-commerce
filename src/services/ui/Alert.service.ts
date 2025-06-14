'use client';
import React from 'react';
import { createRoot } from 'react-dom/client';
import ModalAlert from '../../components/ui/modal-alert/ModalAlert';

type AlertOptions = {
	title: string;
	message: string;
	timeout?: number;
	onClose?: () => void;
};

class AlertService {
	private static container: HTMLDivElement | null = null;
	private static root: any = null;

	private static initialize() {
		if (typeof window !== 'undefined' && !this.container) {
			this.container = document.createElement('div');
			this.container.id = 'alert-container';
			document.body.appendChild(this.container);
			this.root = createRoot(this.container);
		}
	}

	private static show(type: 'success' | 'warning' | 'error' | 'info', options: AlertOptions) {
		this.initialize();

		if (typeof window === 'undefined' || !this.root) {
			return;
		}

		const handleClose = () => {
			if (options.onClose) {
				options.onClose();
			}
		};

		this.root.render(
			React.createElement(ModalAlert, {
				title: options.title,
				message: options.message,
				type: type,
				timeout: options.timeout,
				onClose: handleClose,
			})
		);
	}

	static success(options: AlertOptions) {
		this.show('success', options);
	}

	static warning(options: AlertOptions) {
		this.show('warning', options);
	}

	static error(options: AlertOptions) {
		this.show('error', options);
	}

	static info(options: AlertOptions) {
		this.show('info', options);
	}

	static close() {
		if (this.root) {
			this.root.render(null);
		}
	}
}

export default AlertService;
