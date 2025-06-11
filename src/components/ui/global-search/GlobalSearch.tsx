import React from 'react';
import GlobalSearchContextProvider from '@/contexts/GlobalSearch/GlobalSearchContextProvider';
import GlobalSearchFullBody from './GlobalSearchFullBody';
import GlobalSearchDesktopBody from './GlobalSearchDesktopBody';

type GlobalSearchProps = {
	isFull?: boolean;
};

export default function GlobalSearch({ isFull }: GlobalSearchProps) {
	return <GlobalSearchContextProvider>{!isFull ? <GlobalSearchDesktopBody /> : <GlobalSearchFullBody />}</GlobalSearchContextProvider>;
}
