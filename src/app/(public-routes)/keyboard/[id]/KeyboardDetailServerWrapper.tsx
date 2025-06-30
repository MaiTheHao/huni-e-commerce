import { BASE_URL } from '@/consts/url';
import { IKeyboard, TErrorFirst } from '@/interfaces';
import KeyboardDetailClientWrapper from './KeyboardDetailClientWrapper';
import { toString } from '@/util';

const fetchKeyboards = async (): Promise<TErrorFirst<Error, IKeyboard[]>> => {
	try {
		const limit = 100;
		const response = await fetch(`${BASE_URL}/product/keyboard?limit=${limit}`, { next: { revalidate: 86400 } });
		if (!response.ok) throw new Error('Failed to fetch keyboards');
		const data = await response.json();
		return [null, data.keyboards as IKeyboard[]];
	} catch (error) {
		return [error as Error, []];
	}
};

const fetchKeyboardById = async (id: string): Promise<TErrorFirst<Error, IKeyboard | null>> => {
	try {
		const response = await fetch(`${BASE_URL}/product/keyboard/${id}`, { next: { revalidate: 3600 } });
		if (!response.ok) throw new Error('Failed to fetch keyboard');
		const data = await response.json();
		return [null, data.keyboard as IKeyboard];
	} catch (error) {
		return [error as Error, null];
	}
};

export async function generateStaticParams() {
	const [error, keyboards] = await fetchKeyboards();
	if (error || !keyboards) return [];
	return keyboards.map((keyboard) => ({
		id: toString(keyboard._id),
	}));
}

export default async function KeyboardDetailServerWrapper({ params }: { params: { id: string } }) {
	const [error, keyboard] = await fetchKeyboardById(params.id);

	if (error || !keyboard) {
		return (
			<div>
				<h1>Không tìm thấy bàn phím</h1>
				<p>Xin lỗi, không thể tải thông tin bàn phím này.</p>
			</div>
		);
	}

	return <KeyboardDetailClientWrapper keyboard={keyboard} />;
}
