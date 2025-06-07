'use client';
import React, { memo, ReactNode, useEffect, useRef, useState, CSSProperties } from 'react';
import styles from './ModalSideBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

type SideBarProps = {
	title?: string | ReactNode;
	children?: ReactNode;
	stickyFooter?: ReactNode;
	isOpen: boolean;
	setOpen: (value: boolean) => void;
	onOpen?: () => void;
	closeIcon?: ReactNode;
	className?: string;
	contentClassName?: string;
};

function ModalSidebar({
	title = 'Sidebar',
	children = null,
	stickyFooter = null,
	isOpen,
	setOpen,
	onOpen = () => {},
	closeIcon = <FontAwesomeIcon icon={faCircleXmark} />,
	className = '',
	contentClassName = '',
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

		if (isOpen) {
			onOpen();
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setOpen]);

	if (!isOpen) return null;
	return (
		<div className={`${styles.sideBarModal} ${isClosing ? styles.slideOut : styles.slideIn} ${className}`}>
			<div className={`${styles.sideBarModalContent} ${contentClassName}`} ref={sideBarModalContentRef}>
				<div className={styles.sideBarModalHeader}>
					{typeof title === 'string' ? <h2>{title}</h2> : title}
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
				<div className={styles.sideBarModalFooterStickyFooter}>{stickyFooter}</div>
			</div>
		</div>
	);
}

export default memo(ModalSidebar);
