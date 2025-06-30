'use client';
import { IAccessTokenPayload } from '@/interfaces';
import { createContext } from 'react';

export interface IAuthContextUser extends Pick<IAccessTokenPayload, 'uid' | 'email' | 'name' | 'avatar' | 'roles' | 'oauthProviders'> {}

export interface IAuthContextProps {
	user: IAuthContextUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (accessToken: string) => void;
	logout: () => Promise<boolean>;
	updateUser: (user: Partial<IAuthContextUser>) => void;
	validAdmin: () => Promise<boolean>;
	refreshProfile: () => void;
}

export const AuthContext = createContext<IAuthContextProps | undefined>(undefined);
