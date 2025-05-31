import { Model, FilterQuery, Types } from 'mongoose';
import { MongoBaseRepository } from './mongo-base.repository';
import { IHeroSection, IHeroSectionDocument, PaginatedResult } from '@/interfaces';
import { HeroSectionModel } from '../database/schemas/hero-section.schema';

class HeroSectionRepository extends MongoBaseRepository<IHeroSection, IHeroSectionDocument> {
	private static instance: HeroSectionRepository;

	private constructor() {
		super(HeroSectionModel);
	}

	static getInstance(): HeroSectionRepository {
		if (!HeroSectionRepository.instance) {
			HeroSectionRepository.instance = new HeroSectionRepository();
		}
		return HeroSectionRepository.instance;
	}

	async findByCategory(
		category: string,
		page: number = 1,
		limit: number = 1000
	): Promise<PaginatedResult<IHeroSectionDocument[]>> {
		return await this.findWithPagination(page, limit, { category: { $regex: category, $options: 'i' } });
	}
}

export const heroSectionRepository = HeroSectionRepository.getInstance();
