import mongoose from 'mongoose';

export interface IProductDetailMarkdown {
	_id: string | mongoose.Types.ObjectId;
	productId: string | mongoose.Types.ObjectId;
	description: string;
	specifications: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IProductDetailMarkdownDocument extends mongoose.Document<mongoose.Types.ObjectId> {}
