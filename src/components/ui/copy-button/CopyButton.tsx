'use client';

import React, { useState, useRef } from 'react';
import styles from './CopyButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

type Props = {
	value: string;
};

function CopyButton({ value }: Props) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => setCopied(false), 1500);
		} catch (err) {
			Swal.fire({
				icon: 'error',
				title: 'Sao chép thất bại',
				text: 'Không thể sao chép vào clipboard.',
			});
		}
	};

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<button type='button' className={`${styles['copy-button']} `} onClick={handleCopy} aria-label='Copy to clipboard' title={copied ? 'Copied!' : 'Copy to clipboard'}>
			<FontAwesomeIcon icon={copied ? faCheck : faCopy} className={`${styles['copy-button__icon']} ${copied ? styles['copy-button--copied'] : ''}`} />
			<span className={styles['copy-button__text']}>{copied ? 'Copied!' : 'Copy'}</span>
		</button>
	);
}

export default CopyButton;
