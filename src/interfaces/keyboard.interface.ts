import mongoose from 'mongoose';
import { IProduct, PRODUCT_SORTABLE_FIELDS, ProductSearchCriteria } from './product.interface';
import { PRODUCT_SEARCHABLE_FIELDS, PRODUCT_FILTERABLE_FIELDS } from './product.interface';
import { TFilterCriteria, TSortCriteria, TSearchCriteria } from './filter-sort-criteria.interface';

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
export type KeyboardSearchableFields = (typeof KEYBOARD_SEARCHABLE_FIELDS)[number];

export const KEYBOARD_SORTABLE_FIELDS = [...PRODUCT_SORTABLE_FIELDS, 'layout'] as const;
export type KeyboardSortableFields = (typeof KEYBOARD_SORTABLE_FIELDS)[number];

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
] as const;
export type KeyboardFilterableFields = (typeof KEYBOARD_FILTERABLE_FIELDS)[number];

// CRITERIA TYPES
export type KeyboardFilterCriteria = TFilterCriteria<KeyboardFilterableFields>;
export type KeyboardSortCriteria = TSortCriteria<KeyboardSortableFields>;
export type KeyboardSearchCriteria = TSearchCriteria & ProductSearchCriteria;
