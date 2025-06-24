import AppHeader from '@/components/layout/app-header/AppHeader';
import AppFooter from '@/components/layout/app-footer/AppFooter';
import AppBody from '@/components/layout/app-body/AppBody';

export default function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<AppHeader />
			<AppBody>{children}</AppBody>
			<AppFooter />
		</>
	);
}
