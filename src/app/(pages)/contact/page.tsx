import AppBody from '@/components/app-body/AppBody';
import styles from './Contact.module.scss';
import React from 'react';
import ContactFormSection from './ContactFormSection';
import ContactInfoSection from './ContactInfoSection';
import Image from 'next/image';

type Props = {};

function page({}: Props) {
	return (
		<AppBody>
			<section className={styles.contactHeader}>
				<h1 className={styles.contactHeaderItem}>Liên hệ ngay với chúng tôi</h1>
				<p className={styles.contactHeaderItem}>
					Đừng ngần ngại liên hệ nếu bạn cần tư vấn, hỗ trợ kỹ thuật hoặc có bất kỳ thắc mắc nào.
				</p>
			</section>
			<section className={styles.contactBody}>
				<ContactFormSection />
				<ContactInfoSection />
			</section>
			<section className={styles.contactFooter}>
				<Image src='/svgs/map.svg' alt='Bản đồ vị trí cửa hàng' fill loading='lazy' />
			</section>
		</AppBody>
	);
}

export default page;
