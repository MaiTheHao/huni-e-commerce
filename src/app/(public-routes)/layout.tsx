import AppHeader from '@/components/layout/app-header/AppHeader';
import AppFooter from '@/components/layout/app-footer/AppFooter';
import AppBody from '@/components/layout/app-body/AppBody';
import DeliveryInfoContextProvider from '../../contexts/DeliveryInfoContext/DeliveryInfoContextProvider';

export default function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<DeliveryInfoContextProvider>
			<AppHeader />
			<AppBody>{children}</AppBody>
			<AppFooter />
		</DeliveryInfoContextProvider>
	);
}
