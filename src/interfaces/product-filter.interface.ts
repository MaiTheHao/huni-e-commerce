import mongoose from 'mongoose';

export interface IProductFilter {
	_id: string;
	productType: string;
	fields: {
		fieldName: string;
		type: 'string' | 'number' | 'boolean' | 'range';
		label: string;
		options:
			| {
					value: string;
					label: string;
			  }[]
			| [number, number];
		filterable: boolean;
		sortable: boolean;
		customSortOrder?: string[];
		sortType?: 'alpha' | 'num' | 'custom';
	}[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IProductFilterDocument extends mongoose.Document<mongoose.Types.ObjectId> {}
