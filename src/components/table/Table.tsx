'use client';
import React, { ReactNode } from 'react';
import styles from './Table.module.scss';
import clsx from 'clsx';

interface TableSection {
	title?: string;
	titles?: string[]; // For dual titles like cart items
	children: ReactNode;
}

interface TableProps {
	sections: TableSection[];
	loading?: boolean;
	className?: string;
	footer?: ReactNode; // For buttons, discount sections, etc.
}

const Table: React.FC<TableProps> = ({ sections, loading = false, className, footer }) => {
	return (
		<section className={clsx(styles.table, className)}>
			{sections.map((section, index) => (
				<div key={index} className={styles.tableSection}>
					{/* Render header nếu có title hoặc titles */}
					{(section.title || section.titles) && (
						<div className={styles.tableHeader}>
							{section.titles ? (
								// Dual titles cho cart items
								section.titles.map((title, titleIndex) => (
									<h1 key={titleIndex} className={styles.tableTitle}>
										{title}
									</h1>
								))
							) : (
								// Single title cho các table khác
								<h1 className={styles.tableTitle}>{section.title}</h1>
							)}
						</div>
					)}

					{/* Body content từ children */}
					<div className={styles.tableBody}>{section.children}</div>
				</div>
			))}

			{/* Footer như discount section, buttons */}
			{footer && <div className={styles.tableFooter}>{footer}</div>}

			{/* Loading overlay */}
			{loading && (
				<div className={styles.loadingOverlay}>
					<div className='spinner'></div>
				</div>
			)}
		</section>
	);
};

export default Table;
