import { TSortCriteria } from '@/interfaces';
import { productCRUDService } from './productCRUD.service';

class GlobalSearchService {
	private static instance: GlobalSearchService;
	private constructor() {}
	static getInstance(): GlobalSearchService {
		if (!GlobalSearchService.instance) {
			GlobalSearchService.instance = new GlobalSearchService();
		}
		return GlobalSearchService.instance;
	}

	async searchProducts(keyword: string, page: number = 1, limit: number = 10, sort?: TSortCriteria, projection?: Record<string, any>) {
		return productCRUDService.search(keyword, page, limit, sort, projection);
	}
}

export const globalSearchService = GlobalSearchService.getInstance();
