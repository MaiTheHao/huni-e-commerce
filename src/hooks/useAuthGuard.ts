'use client';
import { useAuthContext } from '@/contexts/AuthContext/useAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loggerService } from '@/services/logger.service';

interface UseAuthGuardOptions {
	redirectTo?: string;
	immediate?: boolean;
	showLoading?: boolean;
}

interface UseAuthGuardReturn {
	isAuthenticated: boolean;
	isLoading: boolean;
	user: any;
	shouldRender: boolean;
	canAccess: boolean;
	showLoadingState: boolean;
	showUnauthorized: boolean;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}): UseAuthGuardReturn {
	const { redirectTo = '/signin', immediate = true, showLoading = true } = options;
	const { isAuthenticated, isLoading, user } = useAuthContext();
	const router = useRouter();
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (isLoading) {
			setShouldRender(false);
			return;
		}

		if (!isAuthenticated) {
			if (immediate) {
				router.push(redirectTo);
			}
			setShouldRender(false);
			return;
		}
		setShouldRender(true);
	}, [isAuthenticated, isLoading, router, redirectTo, immediate, user]);

	return {
		// info Trạng thái authentication
		isAuthenticated,
		isLoading,
		user,

		// info Trạng thái render
		shouldRender,
		canAccess: isAuthenticated && !isLoading,

		// info UI helpers
		showLoadingState: isLoading && showLoading,
		showUnauthorized: !isLoading && !isAuthenticated,
	};
}
