'use client';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { IOrder, TOrderStatus } from '@/interfaces/entity/order/order.entity';
import CustomerInfo from './components/CustomerInfo';
import StatusInfo from './components/StatusInfo';
import ProductsTable from './components/ProductsTable';
import OrderDetailActions from './components/OrderDetailActions';
import styles from './OrderDetail.module.scss';
import { deleteOrder, updateOrder, fetchOrderById, updateOrderStatus } from '../apis';
import Swal from 'sweetalert2';
import Loading from '@/components/ui/loading/Loading';
import CopyButton from '@/components/ui/copy-button/CopyButton';
import { z } from 'zod';
import { emailSchema, nameSchema, phoneSchema } from '@/util/validate-input.util';
import NotFound from '@/app/not-found';

type ViewMode = 'view' | 'edit';

const customerInfoValidate = z.object({
	customerName: nameSchema,
	customerEmail: emailSchema,
	customerPhone: phoneSchema,
	customerAddress: z.string().min(1, 'Địa chỉ không được để trống'),
	additionalInfo: z.string().optional(),
});

const AdminOrderDetailPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const [order, setOrder] = useState<IOrder | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>('view');
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);
	const [editForm, setEditForm] = useState({
		customerName: '',
		customerEmail: '',
		customerPhone: '',
		customerAddress: '',
		additionalInfo: '',
		status: 'pending' as TOrderStatus,
	});
	const [validateCustomerInfoError, setValidateCustomerInfoError] = useState<Record<string, string>>({});
	const isEditedCustomerInfoInvalid = useMemo(() => {
		return Object.values(validateCustomerInfoError).some((error) => error.length > 0);
	}, [validateCustomerInfoError]);

	const resetFormFromOrder = useCallback((orderData: IOrder) => {
		setEditForm({
			customerName: orderData.customerName,
			customerEmail: orderData.customerEmail,
			customerPhone: orderData.customerPhone,
			customerAddress: orderData.customerAddress,
			additionalInfo: orderData.additionalInfo || '',
			status: orderData.status,
		});
		setValidateCustomerInfoError({});
	}, []);

	useEffect(() => {
		if (!id) return;
		fetchOrderData();
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [id]);

	const fetchOrderData = useCallback(async () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		setLoading(true);
		setError(null);

		const [error, orderData] = await fetchOrderById(id, abortController.signal);

		if (error) {
			setError(error?.message || 'Lỗi tải dữ liệu');
		} else if (orderData) {
			setOrder(orderData);
			resetFormFromOrder(orderData);
		}

		setLoading(false);
	}, [id, resetFormFromOrder]);

	const handleDelete = useCallback(async () => {
		if (!order) return;

		setActionLoading('delete');
		try {
			const abortController = new AbortController();
			const [error, result] = await deleteOrder(order, abortController.signal);

			if (error) {
				await Swal.fire({
					title: 'Lỗi!',
					text: error?.message || 'Có lỗi xảy ra khi xóa đơn hàng',
					icon: 'error',
					confirmButtonText: 'Đóng',
				});
				return;
			}

			if (result === 'deleted') {
				await Swal.fire({
					title: 'Thành công!',
					text: 'Đơn hàng đã được xóa thành công',
					icon: 'success',
					confirmButtonText: 'Đóng',
				});
				router.push('/admin/order');
			}
		} catch (err: any) {
			await Swal.fire({
				title: 'Lỗi!',
				text: 'Có lỗi xảy ra khi xóa đơn hàng',
				icon: 'error',
				confirmButtonText: 'Đóng',
			});
		} finally {
			setActionLoading(null);
		}
	}, [order, router]);

	const handleQuickConfirm = useCallback(async () => {
		if (!order || order.status !== 'pending') return;

		setActionLoading('confirm');
		try {
			const result = await Swal.fire({
				title: 'Xác nhận đơn hàng',
				text: `Bạn có muốn xác nhận đơn hàng #${order._id}?`,
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: 'Xác nhận',
				cancelButtonText: 'Hủy',
			});

			if (result.isConfirmed) {
				const abortController = new AbortController();
				const [error, updatedOrder] = await updateOrderStatus(order._id, 'confirmed', abortController.signal);

				if (error) {
					await Swal.fire({
						title: 'Lỗi!',
						text: 'Có lỗi xảy ra khi xác nhận đơn hàng',
						icon: 'error',
						confirmButtonText: 'Đóng',
					});
					return;
				}

				if (updatedOrder) {
					setOrder(updatedOrder);
					setEditForm((prev) => ({ ...prev, status: updatedOrder.status }));
				}

				await Swal.fire({
					title: 'Thành công!',
					text: 'Đơn hàng đã được xác nhận',
					icon: 'success',
					confirmButtonText: 'Đóng',
				});
			}
		} catch (err) {
			await Swal.fire({
				title: 'Lỗi!',
				text: 'Có lỗi xảy ra khi xác nhận đơn hàng',
				icon: 'error',
				confirmButtonText: 'Đóng',
			});
		} finally {
			setActionLoading(null);
		}
	}, [order]);

	const handleSaveEdit = useCallback(async () => {
		if (!order) return;

		// Validate input before saving using Zod schema
		const result = customerInfoValidate.safeParse(editForm);
		const errors: Record<string, string> = {};

		if (!result.success) {
			result.error.errors.forEach((err) => {
				if (err.path && err.path.length > 0) {
					errors[err.path[0]] = err.message;
				}
			});
		}

		setValidateCustomerInfoError(errors);

		if (Object.keys(errors).length > 0) {
			await Swal.fire({
				title: 'Lỗi!',
				text: 'Vui lòng kiểm tra lại thông tin khách hàng.',
				icon: 'error',
				confirmButtonText: 'Đóng',
			});
			return;
		}

		setActionLoading('save');
		try {
			const abortController = new AbortController();
			const [error, updatedOrder] = await updateOrder(order._id, editForm, abortController.signal);

			if (error) {
				await Swal.fire({
					title: 'Lỗi!',
					text: 'Có lỗi xảy ra khi cập nhật thông tin',
					icon: 'error',
					confirmButtonText: 'Đóng',
				});
				return;
			}

			if (updatedOrder) {
				setOrder(updatedOrder);
				setViewMode('view');

				await Swal.fire({
					title: 'Thành công!',
					text: 'Thông tin đơn hàng đã được cập nhật',
					icon: 'success',
					confirmButtonText: 'Đóng',
				});
			}
		} catch (err) {
			await Swal.fire({
				title: 'Lỗi!',
				text: 'Có lỗi xảy ra khi cập nhật thông tin',
				icon: 'error',
				confirmButtonText: 'Đóng',
			});
		} finally {
			setActionLoading(null);
		}
	}, [order, editForm, customerInfoValidate]);

	const handleCancelEdit = useCallback(() => {
		if (!order) return;
		resetFormFromOrder(order);
		setViewMode('view');
	}, [order, resetFormFromOrder]);

	const setEditFormCallback = useCallback((newFormState: typeof editForm | ((prev: typeof editForm) => typeof editForm)) => {
		setEditForm(newFormState);
	}, []);

	if (loading) return <Loading loadingText='Đang tải thông tin đơn hàng...' />;
	if (error && !loading) return <div className='error'>Lỗi: {error}</div>;
	if (!order && !loading && !error) return <NotFound message='Không tìm thấy đơn hàng.' />;
	if (!order) return null;

	return (
		<div className={styles.container}>
			{/* Header with actions */}
			<div className={styles.header}>
				<div className={styles.header__left}>
					<div>
						<h1 className={styles.header__title}>Đơn hàng</h1>
						<span className={styles.header__id}>
							#{order._id} <CopyButton value={order._id} />
						</span>
					</div>
				</div>

				<OrderDetailActions
					viewMode={viewMode}
					orderStatus={order.status}
					actionLoading={actionLoading}
					isEditedCustomerInfoInvalid={isEditedCustomerInfoInvalid}
					onQuickConfirm={handleQuickConfirm}
					onRefresh={fetchOrderData}
					onEdit={() => setViewMode('edit')}
					onDelete={handleDelete}
					onSave={handleSaveEdit}
					onCancel={handleCancelEdit}
				/>
			</div>

			<CustomerInfo
				order={order}
				editMode={viewMode === 'edit'}
				editForm={editForm}
				setEditForm={setEditFormCallback}
				customerInfoValidate={customerInfoValidate}
				validateCustomerInfoError={validateCustomerInfoError}
				setValidateCustomerInfoError={setValidateCustomerInfoError}
			/>
			<StatusInfo order={order} editMode={viewMode === 'edit'} editForm={editForm} setEditForm={setEditFormCallback} />
			<ProductsTable order={order} />
		</div>
	);
};

export default AdminOrderDetailPage;
