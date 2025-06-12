'use client';
import GlobalSearchContextProvider from '@/contexts/GlobalSearch/GlobalSearchContextProvider';
import GlobalSearchFullBody from './GlobalSearchFullBody';

type GlobalSearchProps = {};

export default function GlobalSearchFull({}: GlobalSearchProps) {
	return (
		<GlobalSearchContextProvider>
			<GlobalSearchFullBody />
		</GlobalSearchContextProvider>
	);
}
