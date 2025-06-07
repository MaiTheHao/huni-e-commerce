'use client';
import React, { ReactNode, useEffect, useRef } from 'react';
import styles from './ModalBottom.module.scss';

type ModalBottomProps = {
	isOpen: boolean;
	onClose: () => void;
	children?: ReactNode;
};

function ModalBottom({ isOpen, onClose, children }: ModalBottomProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose();
			}
		}
		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;
	return (
		<div className={styles.modalBottomOverlay}>
			<div className={styles.modalBottomContent} ref={modalRef}>
				<div className={styles.modalBottomBody}>{children}</div>
			</div>
		</div>
	);
}

export default ModalBottom;
