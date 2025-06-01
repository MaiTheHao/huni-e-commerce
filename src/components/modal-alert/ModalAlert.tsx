'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './ModalAlert.module.scss';
import React, { useEffect, useState } from 'react';
import { faBug, faCircleCheck, faCircleInfo, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

const ANIMATION_DURATION = 500;
const ICON_MAP = {
	info: faCircleInfo,
	warning: faTriangleExclamation,
	error: faBug,
	success: faCircleCheck,
};

type ModalAlertProps = {
	title: string;
	message: string;
	timeout?: number;
	onClose?: () => void;
	type?: 'info' | 'warning' | 'error' | 'success';
};

function ModalAlert({ title, message, type = 'success', timeout, onClose }: ModalAlertProps) {
	const [visible, setVisible] = useState(true);
	const [animation, setAnimation] = useState<'slide-in' | 'slide-out'>('slide-in');

	useEffect(() => {
		if (timeout) {
			const timer = setTimeout(() => setAnimation('slide-out'), timeout);
			return () => clearTimeout(timer);
		}
	}, [timeout]);

	useEffect(() => {
		if (animation === 'slide-out') {
			const timer = setTimeout(() => setVisible(false), ANIMATION_DURATION);
			return () => {
				clearTimeout(timer);
				if (onClose) onClose();
			};
		}
	}, [animation]);

	if (!visible) return null;
	return (
		<div className={clsx(styles.modal, styles[type], styles[animation])}>
			<FontAwesomeIcon className={styles.icon} icon={ICON_MAP[type]} />
			<div className={styles.content}>
				<div className={styles.text}>
					<h2 className={styles.title}>{title}</h2>
					<p className={styles.message}>{message}</p>
				</div>
				<button className={styles.button} onClick={() => setAnimation('slide-out')}>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</div>
		</div>
	);
}

export default ModalAlert;
