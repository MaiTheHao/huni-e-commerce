import mongoose from 'mongoose';
import { IProduct } from './product.interface';
import { PRODUCT_SEARCHABLE_FIELDS, PRODUCT_FILTERABLE_FIELDS } from './product.interface';

export interface IKeyboard extends IProduct {
	caseMaterial: string;
	collab: null | string;
	connectivity: IKeyboardConnectivity[];
	hotswap: boolean;
	layout: IKeyboardLayout;
	model: string;
	rapidTrigger: boolean;
	rgb: boolean;
	series: null | string;
	switchType: string;
}

export interface IKeyboardDocument extends mongoose.Document<mongoose.Types.ObjectId> {}

export const KEYBOARD_LAYOUTS = ['Fullsize', '96%', 'TKL', '75%', '65%', '60%'] as const;
export type IKeyboardLayout = (typeof KEYBOARD_LAYOUTS)[number];

export const KEYBOARD_CONNECTIVITIES = ['Type-C', 'Bluetooth', '2.4GHz', 'USB-A'] as const;
export type IKeyboardConnectivity = (typeof KEYBOARD_CONNECTIVITIES)[number];

export const KEYBOARD_SWITCH_TYPES = ['Linear', 'Tactile', 'Clicky', 'Optical', 'Magnetic'] as const;
export type IKeyboardSwitchType = (typeof KEYBOARD_SWITCH_TYPES)[number];

export const KEYBOARD_SEARCHABLE_FIELDS = [...PRODUCT_SEARCHABLE_FIELDS, 'model', 'collab', 'series', 'switchType'];
export type KeyboardSearchableField = (typeof KEYBOARD_SEARCHABLE_FIELDS)[number];

export const KEYBOARD_FILTERABLE_FIELDS = [
	...PRODUCT_FILTERABLE_FIELDS,
	'caseMaterial',
	'collab',
	'connectivity',
	'hotswap',
	'layout',
	'series',
	'switchType',
	'rapidTrigger',
	'rgb',
];
export type KeyboardFilterableField = (typeof KEYBOARD_FILTERABLE_FIELDS)[number];
