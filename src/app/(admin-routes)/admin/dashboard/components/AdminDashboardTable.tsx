'use client';
import React from 'react';
import styles from '../Dashboard.module.scss';
import clsx from 'clsx';

type TableColumn = {
	header: React.ReactNode;
	className?: string;
	key?: string;
};

type TableRow = {
	key?: string | number;
	cells: React.ReactNode[];
	className?: string;
};

type AdminDashboardTableProps = {
	columns: TableColumn[];
	rows: TableRow[];
	tableClassName?: string;
	headClassName?: string;
	bodyClassName?: string;
	emptyMessage?: React.ReactNode;
	cellEmptyValue?: string;
	colSpan?: number;
};

function AdminDashboardTable({ columns, rows, tableClassName, headClassName, bodyClassName, emptyMessage = 'Không tìm thấy dữ liệu', colSpan, cellEmptyValue = 'Rỗng' }: AdminDashboardTableProps) {
	return (
		<table className={`${styles.table} ${tableClassName ?? ''}`}>
			<thead className={`${headClassName ?? ''}`}>
				<tr>
					{columns.map((col, idx) => (
						<th key={col.key ?? idx} className={`${col.className ?? ''}`}>
							{col.header}
						</th>
					))}
				</tr>
			</thead>
			<tbody className={`${bodyClassName ?? ''}`}>
				{rows.length > 0 ? (
					rows.map((row, idx) => (
						<tr key={row.key ?? idx} className={`${row.className ?? ''}`}>
							{row.cells.map((cell, cidx) => (
								<td key={cidx} className={clsx([!cell && styles['table__td--empty']])}>
									{cell || cellEmptyValue}
								</td>
							))}
						</tr>
					))
				) : (
					<tr>
						<td colSpan={colSpan ?? columns.length} style={{ textAlign: 'center' }}>
							<span>{emptyMessage}</span>
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default AdminDashboardTable;
