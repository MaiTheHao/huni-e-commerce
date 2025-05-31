import { information } from '@/consts/socials.setting';
import Image from 'next/image';
import styles from './AppFooter.module.scss';
import React from 'react';

type AppFooterInfomationProps = {};

function AppFooterInfomation({}: AppFooterInfomationProps) {
	return (
		<section aria-label='Thông tin cơ bản' className={styles.information}>
			<div className={styles.logo}>
				<Image src='/svgs/huni_text.svg' width={240} height={82} alt='Huni Logo' />
			</div>
			<ul className={styles.informationList}>
				{information.map((item, index) => (
					<li key={index} className={styles.informationItem} aria-label={item.title}>
						<div className={styles.informationIcon}>
							<Image src={item.whiteIcon} width={16} height={16} alt={item.title} />
						</div>
						<div className={styles.informationContent}>
							<p className={styles.informationText}>{item.content}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

export default AppFooterInfomation;
