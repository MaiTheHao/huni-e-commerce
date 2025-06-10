import { IProductDetailMarkdownBase } from '@/interfaces';
import mongoose from 'mongoose';

export const ProductDetailMarkdownSchema = new mongoose.Schema<IProductDetailMarkdownBase>({
	productId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
	description: { type: String, required: true },
	specifications: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const ProductDetailMarkdownModel = mongoose.models.ProductDetailMarkdown || mongoose.model('ProductDetailMarkdown', ProductDetailMarkdownSchema);
