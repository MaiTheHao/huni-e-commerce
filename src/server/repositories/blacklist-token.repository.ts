import { MongoBaseRepository } from './mongo-base.repository';
import { IBlacklistToken, IBlacklistTokenDocument } from '@/interfaces';
import { BlacklistTokenModel } from '../database/schemas/blacklist-token.schema';
import mongoose from 'mongoose';

class BlacklistTokenRepository extends MongoBaseRepository<IBlacklistToken, IBlacklistTokenDocument> {
	private static instance: BlacklistTokenRepository;

	private constructor() {
		super(BlacklistTokenModel);
	}

	static getInstance(): BlacklistTokenRepository {
		if (!BlacklistTokenRepository.instance) {
			BlacklistTokenRepository.instance = new BlacklistTokenRepository();
		}
		return BlacklistTokenRepository.instance;
	}
	async addToBlacklist(jti: string, userId: string, tokenType: 'refresh' | 'access', issuedAt: Date, expiresAt: Date): Promise<IBlacklistTokenDocument> {
		const blacklistRecord = {
			jti,
			userId: new mongoose.Types.ObjectId(userId),
			tokenType,
			issuedAt,
			expiresAt,
		};

		return await this.create(blacklistRecord);
	}
	async isJTIBlacklisted(jti: string): Promise<boolean> {
		const count = await this.model
			.countDocuments({
				jti,
				expiresAt: { $gt: new Date() },
			})
			.limit(1)
			.exec();

		return count > 0;
	}
	async blacklistUserAllTokens(userId: string, tokenType: 'refresh' | 'access' | 'all', issuedBefore?: Date): Promise<number> {
		const filter: any = {
			userId: new mongoose.Types.ObjectId(userId),
			expiresAt: { $gt: new Date() },
		};

		if (tokenType !== 'all') {
			filter.tokenType = tokenType;
		}

		if (issuedBefore) {
			filter.issuedAt = { $lt: issuedBefore };
		}
		const result = await this.model
			.updateMany(
				filter,
				{
					updatedAt: new Date(),
				},
				{ upsert: false }
			)
			.exec();

		return result.modifiedCount || 0;
	}
	async getBlacklistedTokensByUser(userId: string, tokenType?: 'refresh' | 'access', page: number = 1, limit: number = 10) {
		const filter: any = { userId: new mongoose.Types.ObjectId(userId) };
		if (tokenType) {
			filter.tokenType = tokenType;
		}

		return await this.findWithPagination(page, limit, filter);
	}

	async getTokenInfo(jti: string): Promise<IBlacklistTokenDocument | null> {
		return await this.findOne({ jti });
	}
}

export const blacklistTokenRepository = BlacklistTokenRepository.getInstance();
