'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuthContext from '@/contexts/AuthContext/useAuthContext';
import Loading from '@/components/ui/loading/Loading';
import Swal from 'sweetalert2';

function AdminValidate({ children }: { children: React.ReactNode }) {
	const { validAdmin, isLoading } = useAuthContext();
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
	const [passedGate, setPassedGate] = useState(false);
	const router = useRouter();
	const checkingRef = useRef(false);

	useEffect(() => {
		let mounted = true;
		let timeoutId: NodeJS.Timeout;

		const checkAdmin = async () => {
			checkingRef.current = true;
			const result = await validAdmin();
			if (mounted) {
				setIsAdmin(result);
				if (result && !passedGate) setPassedGate(true);
				if (!result) {
					Swal.fire({
						icon: 'error',
						title: 'Không có quyền truy cập',
						text: 'Bạn không có quyền truy cập vào trang này. Hãy thử đăng nhập lại.',
						confirmButtonText: 'OK',
					});
					router.replace('/home');
				}
			}
			checkingRef.current = false;
			timeoutId = setTimeout(checkAdmin, 600000); // 10m
		};

		checkAdmin();

		return () => {
			mounted = false;
			clearTimeout(timeoutId);
		};
	}, [validAdmin]);

	if ((isLoading || isAdmin === null) && !passedGate) {
		return <Loading loadingText='Đang xác thực quyền truy cập' />;
	}

	if (!isAdmin && !checkingRef.current) {
		return null;
	}

	return <>{children}</>;
}

export default AdminValidate;
