import mongoose from 'mongoose';

export interface IHeroSectionBase {
	name: string;
	title: string;
	attrs: string[];
	cta: string;
	ctaHref: string;
	image: string;
	category: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IHeroSection extends IHeroSectionBase {
	_id: string;
}

export interface IHeroSectionDocument extends IHeroSectionBase, mongoose.Document<mongoose.Types.ObjectId> {}
