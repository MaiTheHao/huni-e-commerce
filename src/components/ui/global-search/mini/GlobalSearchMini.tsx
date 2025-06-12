'use client';
import GlobalSearchContextProvider from '@/contexts/GlobalSearch/GlobalSearchContextProvider';
import GlobalSearchMiniBody from './GlobalSearchMiniBody';

type GlobalSearchProps = {};

export default function GlobalSearchMini({}: GlobalSearchProps) {
	return (
		<GlobalSearchContextProvider>
			<GlobalSearchMiniBody />
		</GlobalSearchContextProvider>
	);
}
