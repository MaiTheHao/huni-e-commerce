import api from '@/services/http-client/axios-interceptor';

export async function fetchRevalidatePath(path: string, revalidateChildren: boolean): Promise<boolean> {
	try {
		await api.post('/revalidate-path', { path, revalidateChildren });
		return true;
	} catch (error) {
		console.error('Error revalidating path:', error);
		return false;
	}
}
