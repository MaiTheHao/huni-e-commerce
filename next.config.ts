import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'akkogear.com.vn',
			},
			{
				protocol: 'https',
				hostname: 'akko.vn',
			},
			{
				protocol: 'https',
				hostname: 'nvs.tn-cdn.net',
			},
			{
				protocol: 'https',
				hostname: 'th.bing.com',
			},
		],
	},
	allowedDevOrigins: ['https://accounts.google.com', 'http://localhost:3000'],
};

export default nextConfig;
