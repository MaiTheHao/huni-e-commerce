export interface AppRoute {
	path: string;
	title: string;
	icon?: any;
}

export type AppRouteWithActive = AppRoute & { isActive: boolean };
