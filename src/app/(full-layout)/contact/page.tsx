import styles from './Contact.module.scss';
import React from 'react';
import ContactFormSection from './ContactFormSection';
import ContactInfoSection from './ContactInfoSection';

function ContactPage() {
	return (
		<>
			<section className={styles.contactHeader}>
				<h1 className={styles.contactHeaderItem}>Liên hệ ngay với chúng tôi</h1>
				<p className={styles.contactHeaderItem}>Đừng ngần ngại liên hệ nếu bạn cần tư vấn, hỗ trợ kỹ thuật hoặc có bất kỳ thắc mắc nào.</p>
			</section>
			<section className={styles.contactBody}>
				<ContactFormSection />
				<ContactInfoSection />
			</section>
			{/* <section className={styles.contactFooter}>
				<Image src='/svgs/map.svg' alt='Bản đồ vị trí cửa hàng' fill loading='lazy' />
			</section> */}
		</>
	);
}

export default ContactPage;
