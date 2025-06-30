'use client';
import AppHeader from '@/components/layout/app-header/AppHeader';
import AppFooter from '@/components/layout/app-footer/AppFooter';
import AppBody from '@/components/layout/app-body/AppBody';
import DeliveryInfoContextProvider from '../../contexts/DeliveryInfoContext/DeliveryInfoContextProvider';
import CartContextProvider from '@/contexts/CartContext/CartContextProvider';
import AuthContextProvider from '@/contexts/AuthContext/AuthContextProvider';

export default function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AuthContextProvider>
			<CartContextProvider>
				<DeliveryInfoContextProvider>
					<AppHeader />
					<AppBody>{children}</AppBody>
					<AppFooter />
				</DeliveryInfoContextProvider>
			</CartContextProvider>
		</AuthContextProvider>
	);
}
