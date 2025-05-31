import mongoose from 'mongoose';

export interface IHeroSection {
	_id: string;
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

export interface IHeroSectionDocument extends mongoose.Document<mongoose.Types.ObjectId> {}
