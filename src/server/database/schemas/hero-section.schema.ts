import { IHeroSection } from '@/interfaces';
import mongoose from 'mongoose';

const HeroSectionSchema = new mongoose.Schema<Omit<IHeroSection, '_id'>>(
	{
		name: { type: String, required: true },
		title: { type: String, required: true },
		attrs: { type: [String], required: true },
		cta: { type: String, required: true },
		ctaHref: { type: String, required: true },
		image: { type: String, required: true },
		category: { type: String, required: true, index: true },
	},
	{
		timestamps: true,
	}
);

HeroSectionSchema.index({ category: 1, createdAt: -1 });
HeroSectionSchema.index({ name: 1, category: 1 });

export const HeroSectionModel = mongoose.models.HeroSection || mongoose.model('HeroSection', HeroSectionSchema);
