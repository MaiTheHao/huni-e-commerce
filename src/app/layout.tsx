import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Montserrat } from 'next/font/google';
import './globals.scss';

const beVietnamPro = Be_Vietnam_Pro({
	variable: '--font-be-vietnam-pro',
	subsets: ['latin', 'vietnamese'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const montSerrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin', 'vietnamese'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
	title: 'HUNI E COMMERCE',
	description: 'Bán Keyboards - Keycaps - Switches. HUNI E COMMERS - Địa chỉ tin cậy cho phím cơ.',
	keywords: ['HUNI', 'E COMMERS', 'Keyboards', 'Keycaps', 'Switches', 'phím cơ', 'bàn phím cơ'],
	openGraph: {
		title: 'HUNI E COMMERS',
		description: 'Bán Keyboards - Keycaps - Switches. HUNI E COMMERS - Địa chỉ tin cậy cho phím cơ.',
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
			<body className={`${beVietnamPro.variable} ${montSerrat.variable}`}>{children}</body>
		</html>
	);
}
