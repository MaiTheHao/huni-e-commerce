import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.scss';
import CartContextProvider from '@/contexts/CartContext/CartContextProvider';
import AuthContextProvider from '@/contexts/AuthContext/AuthContextProvider';

const beVietnamPro = Be_Vietnam_Pro({
	variable: '--font-be-vietnam-pro',
	subsets: ['latin', 'vietnamese'],
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
			<body className={`${beVietnamPro.variable}`}>
				<AuthContextProvider>
					<CartContextProvider>{children}</CartContextProvider>
				</AuthContextProvider>
			</body>
		</html>
	);
}
