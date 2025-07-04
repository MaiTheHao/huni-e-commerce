import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faCheck, faTimes, faRefresh } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import Spinner from '@/components/ui/spinner/Spinner';
import { TOrderStatus } from '@/interfaces/entity/order/order.entity';
import adminStyles from '../../../../Admin.module.scss';
import styles from '../OrderDetail.module.scss';

type ViewMode = 'view' | 'edit';

interface OrderDetailActionsProps {
	viewMode: ViewMode;
	orderStatus: TOrderStatus;
	actionLoading: string | null;
	isEditedCustomerInfoInvalid: boolean;
	onQuickConfirm: () => void;
	onRefresh: () => void;
	onEdit: () => void;
	onDelete: () => void;
	onSave: () => void;
	onCancel: () => void;
}

const OrderDetailActions: React.FC<OrderDetailActionsProps> = ({
	viewMode,
	orderStatus,
	actionLoading,
	isEditedCustomerInfoInvalid,
	onQuickConfirm,
	onRefresh,
	onEdit,
	onDelete,
	onSave,
	onCancel,
}) => {
	return (
		<div className={styles.header__actions}>
			{viewMode === 'view' ? (
				<>
					{orderStatus === 'pending' && (
						<button
							onClick={onQuickConfirm}
							disabled={actionLoading === 'confirm'}
							className={clsx(adminStyles['table__action'], adminStyles['table__action--detail'])}
							title='Xác nhận nhanh'
						>
							{actionLoading === 'confirm' ? <Spinner /> : <FontAwesomeIcon icon={faCheck} />}
						</button>
					)}
					<button onClick={onRefresh} disabled={!!actionLoading} className={clsx(adminStyles['table__action'], adminStyles['table__action--detail'])} title='Làm mới'>
						<FontAwesomeIcon icon={faRefresh} />
					</button>
					<button onClick={onEdit} disabled={!!actionLoading} className={clsx(adminStyles['table__action'], adminStyles['table__action--detail'])} title='Chỉnh sửa'>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
					<button onClick={onDelete} disabled={actionLoading === 'delete'} className={clsx(adminStyles['table__action'], adminStyles['table__action--delete'])} title='Xóa'>
						{actionLoading === 'delete' ? <Spinner /> : <FontAwesomeIcon icon={faTrashCan} />}
					</button>
				</>
			) : (
				<>
					<button
						onClick={onSave}
						disabled={actionLoading === 'save' || isEditedCustomerInfoInvalid}
						className={clsx(adminStyles['table__action'], adminStyles['table__action--detail'], isEditedCustomerInfoInvalid ? adminStyles['table__action--disabled'] : '')}
						title='Lưu'
					>
						{actionLoading === 'save' ? <Spinner /> : <FontAwesomeIcon icon={faCheck} />}
					</button>
					<button onClick={onCancel} disabled={!!actionLoading} className={clsx(adminStyles['table__action'], adminStyles['table__action--delete'])} title='Hủy'>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</>
			)}
		</div>
	);
};

export default React.memo(OrderDetailActions);
