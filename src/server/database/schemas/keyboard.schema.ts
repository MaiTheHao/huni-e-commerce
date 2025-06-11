import { IKeyboard, KEYBOARD_CONNECTIVITIES, KEYBOARD_LAYOUTS } from '@/interfaces';
import { SWITCH_TYPES } from '@/interfaces/entity/product/switch.entity';
import mongoose from 'mongoose';

export const KeyboardSchema = new mongoose.Schema<IKeyboard>({
	name: { type: String, required: true },
	modelName: { type: String, required: true },
	price: { type: Number, required: true, min: 0 },
	layout: { type: String, enum: KEYBOARD_LAYOUTS, required: true },
	discountPercent: { type: Number, default: 0, min: 0, max: 100 },
	description: { type: String, default: '' },
	images: { type: [String], default: [] },
	stock: { type: Number, default: 0, min: 0 },
	isActive: { type: Boolean, default: false },
	brand: { type: String, required: true },
	productType: { type: String, default: 'keyboard' },
	caseMaterial: { type: String, required: true },
	switchType: { type: String, enum: SWITCH_TYPES, required: true },
	hotswap: { type: Boolean, default: false },
	rapidTrigger: { type: Boolean, default: false },
	rgb: { type: Boolean, default: false },
	connectivity: {
		type: [String],
		enum: KEYBOARD_CONNECTIVITIES,
		default: [],
	},
	collab: { type: String, default: null },
	series: { type: String, default: null },
	tags: { type: [String], default: [] },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const KeyboardModel = mongoose.models.Keyboard || mongoose.model<IKeyboard>('Keyboard', KeyboardSchema);
