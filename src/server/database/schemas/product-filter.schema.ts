import { IProductFilterBase } from '@/interfaces';
import mongoose from 'mongoose';

const ProductFilterSchema = new mongoose.Schema<IProductFilterBase>(
	{
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
	},
	{
		timestamps: true,
	}
);

ProductFilterSchema.index({ productType: 1, createdAt: -1 });
ProductFilterSchema.index({ 'fields.name': 1, 'fields.filterable': 1 });
ProductFilterSchema.index({ 'fields.sortable': 1, 'fields.sortType': 1 });

export const ProductFilterModel = mongoose.models.ProductFilter || mongoose.model('ProductFilter', ProductFilterSchema);
