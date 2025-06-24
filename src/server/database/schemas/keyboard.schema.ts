import { IKeyboard, KEYBOARD_CONNECTIVITIES, KEYBOARD_LAYOUTS } from '@/interfaces';
import { SWITCH_TYPES } from '@/interfaces/entity/product/switch.entity';
import mongoose from 'mongoose';

const KeyboardSchema = new mongoose.Schema<IKeyboard>(
	{
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
	},
	{
		timestamps: true,
	}
);

KeyboardSchema.index({ name: 1, isActive: 1 });
KeyboardSchema.index({ productType: 1, isActive: 1, createdAt: -1 });
KeyboardSchema.index({ brand: 1, isActive: 1 });
KeyboardSchema.index({ price: 1, isActive: 1 });
KeyboardSchema.index({ layout: 1, switchType: 1, isActive: 1 });
KeyboardSchema.index({ tags: 1, isActive: 1 });
KeyboardSchema.index({ series: 1, collab: 1, isActive: 1 });
KeyboardSchema.index({ stock: 1, isActive: 1 });

export const KeyboardModel = mongoose.models.Keyboard || mongoose.model<IKeyboard>('Keyboard', KeyboardSchema);
