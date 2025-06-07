class ProductFilterQueryBuilderService {
	private static instance: ProductFilterQueryBuilderService;

	private constructor() {}

	public static getInstance(): ProductFilterQueryBuilderService {
		if (!ProductFilterQueryBuilderService.instance) {
			ProductFilterQueryBuilderService.instance = new ProductFilterQueryBuilderService();
		}
		return ProductFilterQueryBuilderService.instance;
	}
}

export const productFilterQueryBuilderService = ProductFilterQueryBuilderService.getInstance();
