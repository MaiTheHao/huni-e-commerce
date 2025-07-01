'use client';
import React from 'react';
import styles from '../../Admin.module.scss';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faEye, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

type TableColumn = {
	header: React.ReactNode;
	className?: string;
	key?: string;
};

type TableRow = {
	key?: string | number;
	cells: React.ReactNode[];
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
	// onView?: (row: TableRow, rowIndex: number) => void;
	// onEdit?: (row: TableRow, rowIndex: number) => void;
	onDetail?: (row: TableRow, rowIndex: number) => void;
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
	cellEmptyValue = 'Rỗng',
	// onView,
	// onEdit,
	onDetail,
	onDelete,
	loading = false,
}: AdminItemsTableProps) {
	const hasActions = !!onDetail || !!onDelete;

	return (
		<table className={`${styles.table} ${tableClassName ?? ''}`}>
			<thead className={`${headClassName ?? ''}`}>
				<tr>
					{columns.map((col, idx) => (
						<th key={col.key ?? idx} className={`${col.className ?? ''}`}>
							{col.header}
						</th>
					))}
					{hasActions && <th className={`${styles['table__actions']}`}>Thao tác</th>}
				</tr>
			</thead>
			<tbody className={`${bodyClassName ?? ''}`}>
				{loading ? (
					<tr>
						<td colSpan={columns.length + (hasActions ? 1 : 0)} className={styles['table__loading']}>
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
							{hasActions && (
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
										{onDetail && (
											<button type='button' className={`${styles['table__action']} ${styles['table__action--detail']}`} title='Chi tiết' onClick={() => onDetail(row, idx)}>
												<FontAwesomeIcon icon={faCircleInfo} />
											</button>
										)}
										{onDelete && (
											<button type='button' className={`${styles['table__action']} ${styles['table__action--delete']}`} title='Xóa' onClick={() => onDelete(row, idx)}>
												<FontAwesomeIcon icon={faTrashCan} />
											</button>
										)}
									</div>
								</td>
							)}
						</tr>
					))
				) : (
					<tr>
						<td colSpan={columns.length + (hasActions ? 1 : 0)} style={{ textAlign: 'center' }}>
							<span>{emptyMessage}</span>
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default AdminItemsTable;
