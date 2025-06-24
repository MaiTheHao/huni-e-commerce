'use client';
import { useContext } from 'react';
import { AuthContext, IAuthContextProps } from './AuthContext';

export const useAuthContext = (): IAuthContextProps => {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useAuthContext phải được sử dụng bên trong AuthContextProvider. ' + 'Hãy wrap component của bạn với <AuthContextProvider>!');
	}

	return context;
};

export default useAuthContext;
