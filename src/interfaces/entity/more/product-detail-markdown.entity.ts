import mongoose from 'mongoose';

export interface IProductDetailMarkdownBase {
	productId: string | mongoose.Types.ObjectId;
	description: string;
	specifications: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IProductDetailMarkdown extends IProductDetailMarkdownBase {
	_id: string;
}

export interface IProductDetailMarkdownDocument extends IProductDetailMarkdownBase, mongoose.Document<mongoose.Types.ObjectId> {}
