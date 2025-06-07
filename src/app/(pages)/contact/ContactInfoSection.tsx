import Table from '@/components/ui/table/Table';
import styles from './Contact.module.scss';
import React from 'react';
import { information, socialLinks } from '@/consts/socials.setting';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';

type Props = {};

function ContactInfoSection({}: Props) {
	return (
		<Table
			sections={[
				{
					title: 'Thông tin liên hệ',
					children: (
						<>
							<ul className={styles.contactInfoList} aria-label='Thông tin liên hệ'>
								{information.map((item) => (
									<li key={item.title} className={styles.contactInfoItem}>
										<div className={styles.contactInfoIcon}>
											<Image src={item.greenIcon} alt={item.title} fill loading='lazy' />
										</div>
										<div className={styles.contactInfoContent}>
											<span className={styles.contactInfoTitle}>{item.title}</span>
											<p className={styles.contactInfoText}>{item.content}</p>
										</div>
									</li>
								))}
							</ul>
							<ul className={styles.socialLinksList} aria-label='Liên kết mạng xã hội'>
								{socialLinks.map((link) => (
									<li key={link.name} className={styles.socialLinkItem}>
										<a
											href={link.href}
											target='_blank'
											rel='noopener noreferrer'
											aria-label={link.name}
											className={clsx(styles.socialLink)}
										>
											<FontAwesomeIcon icon={link.icon} />
										</a>
									</li>
								))}
							</ul>
						</>
					),
				},
			]}
			className={styles.contactInfoSection}
		/>
	);
}

export default ContactInfoSection;
