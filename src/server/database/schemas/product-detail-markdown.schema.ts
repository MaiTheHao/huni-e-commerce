import { IProductDetailMarkdownBase } from '@/interfaces';
import mongoose from 'mongoose';

const ProductDetailMarkdownSchema = new mongoose.Schema<IProductDetailMarkdownBase>(
	{
		productId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
		description: { type: String, required: true },
		specifications: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

ProductDetailMarkdownSchema.index({ productId: 1, createdAt: -1 });

export const ProductDetailMarkdownModel = mongoose.models.ProductDetailMarkdown || mongoose.model('ProductDetailMarkdown', ProductDetailMarkdownSchema);
