'use client';

import { LOCAL_STORAGE_KEYS_MAP } from '@/consts/map-value';
import { useEffect, useState } from 'react';

interface UseLastStandingURLReturn {
	setLastStandingURL: (url: string | null) => void;
	getLastStandingURL: () => string | null;
}

export default function useLastStandingURL(): UseLastStandingURLReturn {
	const [lastStandingURL, setLastStandingURLState] = useState<string | null>(null);

	const setLastStandingURL = (url: string | null) => {
		setLastStandingURLState(url);
		if (typeof window !== 'undefined') {
			localStorage.setItem(LOCAL_STORAGE_KEYS_MAP.LAST_STANDING_URL, url || '');
		}
	};

	const getLastStandingURL = () => lastStandingURL;

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const storedURL = localStorage.getItem(LOCAL_STORAGE_KEYS_MAP.LAST_STANDING_URL) || null;
			setLastStandingURLState(storedURL);
		}
	}, []);

	return {
		setLastStandingURL,
		getLastStandingURL,
	};
}
