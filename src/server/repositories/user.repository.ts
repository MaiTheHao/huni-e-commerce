import { IUser, IUserDocument, USER_FILTERABLE_FIELDS, USER_SEARCHABLE_FIELDS } from '@/interfaces';
import { MongoBaseRepository } from './mongo-base.repository';
import { UserModel } from '../database/schemas/user.schema';

class UserRepository extends MongoBaseRepository<IUser, IUserDocument> {
	private static instance: UserRepository;
	private constructor() {
		super(UserModel, USER_SEARCHABLE_FIELDS, USER_FILTERABLE_FIELDS);
	}
	static getInstance(): UserRepository {
		if (!UserRepository.instance) {
			UserRepository.instance = new UserRepository();
		}
		return UserRepository.instance;
	}

	async findByEmail(email: string, projection?: Record<string, any>): Promise<IUserDocument | null> {
		return this.findOne({ email }, projection);
	}

	async findByPhone(phone: string, projection?: Record<string, any>): Promise<IUserDocument | null> {
		return this.findOne({ phone }, projection);
	}
}

export const userRepository = UserRepository.getInstance();
