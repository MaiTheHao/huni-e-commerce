export type TFilterCriteria<Keys extends string | number | symbol = string> = Partial<
	Record<
		Keys,
		| string[]
		| boolean
		| number[]
		| {
				min: number;
				max: number;
		  }
	>
>;
export type TSortCriteria<Keys extends string | number | symbol = string> = Partial<
	Record<
		Keys,
		{
			order: 1 | -1;
			customSortOrder?: string[];
		}
	>
>;
export type TSearchCriteria = string;
