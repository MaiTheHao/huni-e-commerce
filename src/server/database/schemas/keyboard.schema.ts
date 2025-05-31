import mongoose from 'mongoose';
import { IKeyboard, KEYBOARD_CONNECTIVITIES, KEYBOARD_LAYOUTS } from '@/interfaces';

export const KeyboardSchema = new mongoose.Schema<Omit<IKeyboard, '_id'>>({
	name: { type: String, required: true },
	model: { type: String, required: true },
	price: { type: Number, required: true },
	layout: { type: String, enum: KEYBOARD_LAYOUTS, required: true },
	discountPercent: { type: Number, default: 0, min: 0, max: 100 },
	description: { type: String, default: null },
	images: [{ type: String, default: [] }],
	stock: { type: Number, default: 0 },
	isActive: { type: Boolean, default: false },
	caseMaterial: { type: String, default: null },
	switchType: { type: String, default: null },
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
	tags: [{ type: String, default: [] }],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export const KeyboardModel = mongoose.models.Keyboard || mongoose.model('Keyboard', KeyboardSchema);
