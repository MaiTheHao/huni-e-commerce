import React from 'react';

export interface AppRoute {
	path: string;
	title: string;
	icon?: string | React.ReactNode;
}

export type AppRouteWithActive = AppRoute & { isActive: boolean };
