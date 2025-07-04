'use client';
import React from 'react';
import styles from '../../Admin.module.scss';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

type TableColumn = {
	header: React.ReactNode;
	className?: string;
	key?: string;
};

type TableRow = {
	key?: string | number;
	cells: React.ReactNode[];
	href?: string;
	className?: string;
	data?: any;
};

type AdminItemsTableProps = {
	columns: TableColumn[];
	rows: TableRow[];
	tableClassName?: string;
	headClassName?: string;
	bodyClassName?: string;
	emptyMessage?: React.ReactNode;
	cellEmptyValue?: string;
	onDelete?: (row: TableRow, rowIndex: number) => void;
	loading?: boolean;
};

function AdminItemsTable({
	columns,
	rows,
	tableClassName,
	headClassName,
	bodyClassName,
	emptyMessage = 'Không tìm thấy dữ liệu',
	cellEmptyValue = '-',
	onDelete,
	loading = false,
}: AdminItemsTableProps) {
	return (
		<table className={`${styles.table} ${tableClassName ?? ''}`}>
			<thead className={`${headClassName ?? ''}`}>
				<tr>
					{columns.map((col, idx) => (
						<th key={col.key ?? idx} className={`${col.className ?? ''}`}>
							{col.header}
						</th>
					))}
					<th className={`${styles['table__actions']}`}>Thao tác</th>
				</tr>
			</thead>
			<tbody className={`${bodyClassName ?? ''}`}>
				{loading ? (
					<tr>
						<td colSpan={columns.length + 1} className={styles['table__loading']}>
							<span>Đang tải dữ liệu...</span>
						</td>
					</tr>
				) : rows.length > 0 ? (
					rows.map((row, idx) => (
						<tr key={row.key ?? idx} className={`${row.className ?? ''}`}>
							{row.cells.map((cell, cidx) => (
								<td key={cidx} className={clsx([!cell && styles['table__td--empty']], [columns[cidx]?.className ?? ''])}>
									{cell || cellEmptyValue}
								</td>
							))}

							<td className={styles['table__actions']}>
								<div className={styles['table__actions__wrapper']}>
									{/* {onView && (
											<button type='button' className={`${styles['table__action']} ${styles['table__action--view']}`} title='Xem' onClick={() => onView(row, idx)}>
												<FontAwesomeIcon icon={faEye} />
											</button>
										)}
										{onEdit && (
											<button type='button' className={`${styles['table__action']} ${styles['table__action--edit']}`} title='Sửa' onClick={() => onEdit(row, idx)}>
												<FontAwesomeIcon icon={faPenToSquare} />
											</button>
										)} */}
									{row?.href && (
										<Link href={row?.href || '#'} className={`${styles['table__action']} ${styles['table__action--detail']}`} title='Chi tiết'>
											<FontAwesomeIcon icon={faCircleInfo} />
										</Link>
									)}
									{onDelete && (
										<button type='button' className={`${styles['table__action']} ${styles['table__action--delete']}`} title='Xóa' onClick={() => onDelete(row, idx)}>
											<FontAwesomeIcon icon={faTrashCan} />
										</button>
									)}
								</div>
							</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>
							<span>{emptyMessage}</span>
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default AdminItemsTable;
