'use client';
import React, { memo } from 'react';
import styles from './PaginationBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { IPagination } from '@/interfaces';

type PaginationBarProps = IPagination & {
	onPageChange: (page: number) => void;
	itemType?: string; // ví dụ: 'sản phẩm', 'đơn hàng'
	ariaLabel?: string; // ví dụ: 'Phân trang', 'Phân trang đơn hàng'
	className?: string; // để thêm class tùy chỉnh nếu cần
};

function PaginationBar({ page, total, totalPages, onPageChange, itemType = 'sản phẩm', ariaLabel = 'Phân trang', className }: PaginationBarProps) {
	const handlePageChange = (newPage: number) => {
		if (newPage !== page && newPage > 0 && newPage <= totalPages) {
			onPageChange(newPage);
		}
	};

	const renderPageButton = (p: number) => (
		<li key={p}>
			<button className={`${styles.PaginationItem} ${p === page ? styles.active : ''}`} aria-current={p === page ? 'page' : undefined} onClick={() => handlePageChange(p)} disabled={p === page}>
				{p}
			</button>
		</li>
	);

	const getVisiblePages = () => {
		return [page - 1, page, page + 1].filter((p) => p > 0 && p <= totalPages);
	};

	const shouldShowFirstPage = page > 2;
	const shouldShowLastPage = page < totalPages - 1;
	const shouldShowFirstEllipsis = page > 3;
	const shouldShowLastEllipsis = page < totalPages - 2;

	return (
		<nav className={`${styles.PaginationBar} ${className}`} aria-label={ariaLabel}>
			<div className={styles.PaginationInfo}>
				<span>
					Tổng <b>{total}</b> {itemType} | Trang <b>{page}</b>/<b>{totalPages}</b>
				</span>
			</div>
			<ul className={styles.PaginationList}>
				<li>
					<button disabled={page === 1} aria-label='Trang trước' className={styles.PaginationButton} onClick={() => handlePageChange(page - 1)}>
						<FontAwesomeIcon icon={faAngleLeft} />
					</button>
				</li>

				{shouldShowFirstPage && (
					<li>
						<button onClick={() => handlePageChange(1)} className={styles.PaginationItem}>
							1{shouldShowFirstEllipsis && <span>...</span>}
						</button>
					</li>
				)}

				{getVisiblePages().map(renderPageButton)}

				{shouldShowLastPage && (
					<li>
						<button className={styles.PaginationItem} onClick={() => handlePageChange(totalPages)}>
							{shouldShowLastEllipsis && <span>...</span>}
							{totalPages}
						</button>
					</li>
				)}

				<li>
					<button disabled={page === totalPages} aria-label='Trang sau' className={styles.PaginationButton} onClick={() => handlePageChange(page + 1)}>
						<FontAwesomeIcon icon={faAngleRight} />
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default memo(PaginationBar);
