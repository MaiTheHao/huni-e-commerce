import { IUser, IUserDocument } from '@/interfaces';
import { MongoBaseRepository } from './mongo-base.repository';
import { UserModel } from '../database/schemas/user.schema';

class UserRepository extends MongoBaseRepository<IUser, IUserDocument> {
	private static instance: UserRepository;
	private constructor() {
		super(UserModel);
	}
	static getInstance(): UserRepository {
		if (!UserRepository.instance) {
			UserRepository.instance = new UserRepository();
		}
		return UserRepository.instance;
	}

	async signup(email: string, name: string, password: string, salt: Buffer): Promise<IUserDocument> {
		await this.ensureConnected();
		const newUser = new this.model({ email, name, password, salt });
		return newUser.save();
	}

	async findByEmail(email: string): Promise<IUserDocument | null> {
		await this.ensureConnected();
		return this.model.findOne({ email });
	}

	async findByPhone(phone: string): Promise<IUserDocument | null> {
		await this.ensureConnected();
		return this.model.findOne({ phone });
	}
}

export const userRepository = UserRepository.getInstance();
