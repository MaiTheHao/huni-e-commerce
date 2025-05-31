import { MongoBaseRepository } from './mongo-base.repository';
import { IKeyboard, IKeyboardDocument, KEYBOARD_SEARCHABLE_FIELDS, KEYBOARD_FILTERABLE_FIELDS } from '@/interfaces';
import { KeyboardModel } from '../database/schemas';

class KeyboardRepository extends MongoBaseRepository<IKeyboard, IKeyboardDocument> {
	private static instance: KeyboardRepository;

	private constructor() {
		super(KeyboardModel, KEYBOARD_SEARCHABLE_FIELDS, KEYBOARD_FILTERABLE_FIELDS);
	}

	static getInstance(): KeyboardRepository {
		if (!KeyboardRepository.instance) {
			KeyboardRepository.instance = new KeyboardRepository();
		}
		return KeyboardRepository.instance;
	}
}

export const keyboardRepository = KeyboardRepository.getInstance();
