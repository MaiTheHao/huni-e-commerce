'use client';
import { usePathname } from 'next/navigation';
import { FOOTER_ROUTES_GROUPED } from '@/consts/routes.setting';
import { AppRouteWithActive } from '@/interfaces';
import { useMemo } from 'react';

/**
 * Trả về FOOTER_ROUTES_GROUPED với trường isActive dựa trên pathname hiện tại.
 */
export function useFooterRoutes(): { [group: string]: AppRouteWithActive[] } {
	const pathname = usePathname();

	return useMemo(() => {
		const result: { [group: string]: AppRouteWithActive[] } = {};
		for (const [group, routes] of Object.entries(FOOTER_ROUTES_GROUPED)) {
			result[group] = routes.map((route) => ({
				...route,
				isActive: typeof route.path === 'string' && pathname === route.path,
			}));
		}
		return result;
	}, [pathname]);
}
