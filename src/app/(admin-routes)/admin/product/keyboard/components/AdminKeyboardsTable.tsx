'use client';
import React from 'react';
import styles from '../../../../Admin.module.scss';
import { toLocalePrice } from '@/util';
import { formatDateToVietnameseString } from '@/util/date';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import AdminItemsTable from '../../../components/AdminItemsTable';
import { IKeyboard } from '@/interfaces/entity/product/keyboard.entity';

type AdminKeyboardsTableProps = {
	keyboards: IKeyboard[];
	emptyMessage?: string;
	isLoading?: boolean;
};

function AdminKeyboardsTable({ keyboards, emptyMessage = 'Không có bàn phím nào.', isLoading = false }: AdminKeyboardsTableProps) {
	const handleDetailKeyboard = (keyboard: IKeyboard) => {
		alert(`View keyboard details: ${JSON.stringify(keyboard, null, 2)}`);
	};

	const handleDeleteKeyboard = (keyboard: IKeyboard) => {
		console.log('Delete keyboard:', keyboard);
	};

	return (
		<AdminItemsTable
			columns={[
				{ header: 'ID', className: styles['table-col--id'] },
				{ header: 'Tên sản phẩm', className: styles['keyboards-table-col--name'] },
				{ header: 'Model', className: styles['keyboards-table-col--model'] },
				{ header: 'Layout', className: styles['keyboards-table-col--layout'] },
				{ header: 'Switch', className: styles['keyboards-table-col--switch'] },
				{ header: 'Giá', className: styles['keyboards-table-col--price'] },
				{ header: 'Kho', className: styles['keyboards-table-col--stock'] },
				{ header: 'Trạng thái', className: styles['keyboards-table-col--status'] },
				{ header: 'Ngày tạo', className: styles['keyboards-table-col--created'] },
			]}
			rows={
				keyboards?.map((keyboard) => ({
					key: keyboard._id,
					cells: [
						<div className={styles['table-col--id__wrapper']} key='id'>
							<p className={styles['table-col--id__value']}>#{keyboard._id}</p>
							<CopyButton value={keyboard._id} />
						</div>,
						keyboard.name,
						keyboard.modelName,
						keyboard.layout,
						keyboard.switchType,
						<span className='price' key='price'>
							{toLocalePrice(keyboard.price)}
						</span>,
						keyboard?.stock || '0',
						<span key='status' className={keyboard.isActive ? styles['status--active'] : styles['status--inactive']}>
							{keyboard.isActive ? 'Hoạt động' : 'Không hoạt động'}
						</span>,
						formatDateToVietnameseString(keyboard.createdAt),
					],
					data: keyboard,
				})) ?? []
			}
			emptyMessage={emptyMessage}
			onDetail={(row) => handleDetailKeyboard(row.data)}
			onDelete={(row) => handleDeleteKeyboard(row.data)}
			loading={isLoading}
		/>
	);
}

export default AdminKeyboardsTable;
