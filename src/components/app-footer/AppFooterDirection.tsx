'use client';
import React from 'react';
import styles from './AppFooter.module.scss';
import { useFooterRoutes } from '@/hooks/useFooterRoutes';
import Link from 'next/link';
import clsx from 'clsx';
import AppFooterSocials from './AppFooterSocials';

type AppFooterDirectionProps = {};

function AppFooterDirection({}: AppFooterDirectionProps) {
	const footerRoutesGrouped = useFooterRoutes();
	return (
		<section aria-label='Thông tin điều hướng' className={styles.direction}>
			<ul className={styles.directionList}>
				{Object.entries(footerRoutesGrouped).map(([group, routes]) => {
					const groupTitles: Record<string, string> = {
						direction: 'Điều hướng',
						policy: 'Chính sách',
					};
					return (
						<section key={group} className={styles.directionGroup}>
							<h5 className={styles.directionTitle}>{groupTitles[group] || group}</h5>
							<ul className={styles.directionLinks}>
								{routes.map((item, index) => (
									<li key={index} className={styles.directionItem}>
										<Link
											href={item.path}
											className={clsx(styles.directionLink, 'link-underline', {
												['link-underline--active']: item.isActive,
											})}
											aria-label={item.title}
										>
											{item.title}
										</Link>
									</li>
								))}
							</ul>
						</section>
					);
				})}

				<section className={styles.directionGroup}>
					<h5 className={styles.directionTitle}>Theo dõi shop</h5>
					<AppFooterSocials
						className={styles.directionSocials}
						itemClassName={styles.directionSocialsItem + ' ' + styles.directionItem}
						iconClassName={styles.directionSocial}
					/>
				</section>
			</ul>
		</section>
	);
}

export default AppFooterDirection;
