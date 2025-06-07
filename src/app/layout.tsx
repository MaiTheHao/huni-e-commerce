import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.scss';
import AppHeader from '@/components/layout/app-header/AppHeader';
import AppFooter from '@/components/layout/app-footer/AppFooter';
import CartContextProvider from '@/contexts/CartContext/CartContextProvider';

const beVietnamPro = Be_Vietnam_Pro({
	variable: '--font-be-vietnam-pro',
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
	title: 'HUNI E COMMERCE',
	description: 'Bán Keyboards - Keycaps - Switches. HUNI E COMMERS - Địa chỉ tin cậy cho dân chơi phím cơ.',
	keywords: ['HUNI', 'E COMMERS', 'Keyboards', 'Keycaps', 'Switches', 'phím cơ', 'bàn phím cơ'],
	openGraph: {
		title: 'HUNI E COMMERS',
		description: 'Bán Keyboards - Keycaps - Switches. HUNI E COMMERS - Địa chỉ tin cậy cho dân chơi phím cơ.',
		type: 'website',
		locale: 'vi_VN',
		url: 'https://huni-e-commerce-client.vercel.app',
		siteName: 'HUNI E COMMERS',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='vi'>
			<CartContextProvider>
				<body className={`${beVietnamPro.variable}`}>
					<AppHeader />
					{children}
					<AppFooter />
				</body>
			</CartContextProvider>
		</html>
	);
}
