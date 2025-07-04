import { Suspense } from 'react';
export const dynamic = 'force-dynamic';

import AdminDashboardServerWrapper from './AdminDashboardServerWrapper';
import Loading from '@/components/ui/loading/Loading';

export default function AdminDashboardPage() {
	return (
		<Suspense fallback={<Loading loadingText='Đang tải dữ liệu...' />}>
			<AdminDashboardServerWrapper />
		</Suspense>
	);
}
