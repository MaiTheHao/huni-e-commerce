'use client';
import React, { memo, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './ModalSideBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type SideBarProps = {
	title?: string;
	children?: ReactNode;
	isOpen: boolean;
	setOpen: (value: boolean) => void;
	closeIcon?: ReactNode;
};

function ModalSidebar({
	title = 'Sidebar',
	children = null,
	isOpen,
	setOpen,
	closeIcon = <FontAwesomeIcon icon={faCircleXmark} />,
}: SideBarProps) {
	const sideBarModalContentRef = useRef<HTMLDivElement>(null);
	const [isClosing, setClosing] = useState<boolean>(false);

	const handleClose = () => {
		setClosing(true);
		setTimeout(() => {
			setOpen(false);
			setClosing(false);
		}, 600);
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const modalContent = sideBarModalContentRef.current;
			if (modalContent && !modalContent.contains(event.target as Node)) {
				handleClose();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setOpen]);

	if (!isOpen) return null;
	return (
		<div className={`${styles.sideBarModal} ${isClosing ? styles.slideOut : styles.slideIn}`}>
			<div className={`${styles.sideBarModalContent}`} ref={sideBarModalContentRef}>
				<div className={styles.sideBarModalHeader}>
					<h2>{title}</h2>
					<button
						className={styles.closeButton}
						onClick={handleClose}
						aria-label='Close sidebar'
						type='button'
					>
						{closeIcon}
					</button>
				</div>
				<div className={styles.sideBarModalBody}>{children}</div>
			</div>
		</div>
	);
}

export default memo(ModalSidebar);
