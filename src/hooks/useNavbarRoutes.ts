'use client';
import { usePathname } from 'next/navigation';
import { NAVBAR_ROUTES } from '@/consts/routes.setting';
import { AppRouteWithActive } from '@/interfaces';
import { useMemo } from 'react';

/**
 * Trả về NAVBAR_ROUTES với trường isActive dựa trên pathname hiện tại.
 */
export function useNavbarRoutes(): AppRouteWithActive[] {
	const pathname = usePathname();

	return useMemo(
		() =>
			NAVBAR_ROUTES.map((route) => ({
				...route,
				isActive: typeof route.path === 'string' && pathname === route.path,
			})),
		[pathname]
	);
}
