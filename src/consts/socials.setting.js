import data from '@/data/info.json';
import { faFacebook, faInstagram, faTiktok, faYoutube } from '@fortawesome/free-brands-svg-icons';

const socials = data.socials;
export const socialLinks = [
	{
		name: 'Facebook',
		icon: faFacebook,
		href: socials.facebook,
	},
	{
		name: 'Instagram',
		icon: faInstagram,
		href: socials.instagram,
	},
	{
		name: 'TikTok',
		icon: faTiktok,
		href: socials.tiktok,
	},
	{
		name: 'YouTube',
		icon: faYoutube,
		href: socials.youtube,
	},
];

export const information = [
	{
		title: 'Địa chỉ shop',
		content: data.address,
		whiteIcon: '/svgs/location_white.svg',
		greenIcon: '/svgs/location_green.svg',
	},
	{
		title: 'Số điện thoại',
		content: data.phone,
		whiteIcon: '/svgs/phone_white.svg',
		greenIcon: '/svgs/phone_green.svg',
	},
	{
		title: 'Lịch làm việc',
		content: data.openingHours,
		whiteIcon: '/svgs/calender_white.svg',
		greenIcon: '/svgs/calender_green.svg',
	},
];
