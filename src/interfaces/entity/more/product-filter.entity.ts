import mongoose from 'mongoose';

export interface IProductFilterBase {
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

export interface IProductFilter extends IProductFilterBase {
	_id: string;
}

export interface IProductFilterDocument extends IProductFilterBase, mongoose.Document<mongoose.Types.ObjectId> {}
