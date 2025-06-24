import Link from 'next/link';
import styles from './NotificationPage.module.scss';
import clsx from 'clsx';

const TEXT_ICONS = {
	SUCCESS: '✔️',
	ERROR: '❌',
	INFO: 'ℹ️',
	WARNING: '⚠️',
	LOADING: '⏳',
} as const;

type NotificationPageProps = {
	type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING' | 'LOADING';
	title: string;
	content: string | React.ReactNode;
	cta?: {
		text: string;
		onClick?: () => void;
		href?: string;
	};
};

export function NotificationPage({ type, title, content, cta }: NotificationPageProps) {
	return (
		<div className={styles.container}>
			<div className={clsx(styles.block, styles[type.toLowerCase()])}>
				<div className={styles.header}>
					<span className={styles['header__text-icon']}>{TEXT_ICONS[type]}</span>
					<span className={styles['header__text']}>{title}</span>
				</div>
				<div className={styles.body}>
					<p className={styles.body__content}>{content}</p>
					{cta ? (
						cta.href ? (
							<Link href={cta.href} className={`${styles.body__cta} `}>
								{cta.text}
							</Link>
						) : (
							<button className={`${styles.body__cta} `} onClick={cta.onClick}>
								{cta.text}
							</button>
						)
					) : null}
				</div>
			</div>
		</div>
	);
}
