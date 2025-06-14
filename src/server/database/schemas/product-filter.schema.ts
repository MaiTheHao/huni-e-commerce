import { IProductFilterBase } from '@/interfaces';
import mongoose from 'mongoose';

const ProductFilterSchema = new mongoose.Schema<IProductFilterBase>({
	productType: { type: String, required: true, unique: true, index: true },
	fields: [
		{
			_id: false,
			name: { type: String, required: true },
			type: { type: String, enum: ['string', 'number', 'boolean', 'range'], required: true },
			label: { type: String, required: true },
			options: { type: [mongoose.Schema.Types.Mixed], default: [] },
			filterable: { type: Boolean, required: true },
			sortable: { type: Boolean, required: true },
			customSortOrder: { type: [String], default: [] },
			sortType: { type: String, enum: ['alpha', 'num', 'custom'], required: true },
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const ProductFilterModel = mongoose.models.ProductFilter || mongoose.model('ProductFilter', ProductFilterSchema);
