import mongoose from 'mongoose';
import { IProductBase, PRODUCT_FILTERABLE_FIELDS, PRODUCT_SEARCHABLE_FIELDS, PRODUCT_SORTABLE_FIELDS, ProductSearchCriteria } from './product.entity';
import { TFilterCriteria, TSortCriteria } from '@/interfaces';

export interface IKeyboardBase extends IProductBase {
	caseMaterial: string;
	collab: string | null;
	connectivity: IKeyboardConnectivity[];
	hotswap: boolean;
	layout: IKeyboardLayout;
	modelName: string;
	rapidTrigger: boolean;
	rgb: boolean;
	series: string | null;
	switchType: IKeyboardSwitchType;
}

export interface IKeyboard extends IKeyboardBase {
	_id: string;
}

export interface IKeyboardDocument extends IKeyboardBase, mongoose.Document<mongoose.Types.ObjectId> {}

export const KEYBOARD_LAYOUTS = ['Fullsize', '96%', 'TKL', '75%', '65%', '60%'] as const;
export type IKeyboardLayout = (typeof KEYBOARD_LAYOUTS)[number];

export const KEYBOARD_CONNECTIVITIES = ['Type-C', 'Bluetooth', '2.4GHz', 'USB-A'] as const;
export type IKeyboardConnectivity = (typeof KEYBOARD_CONNECTIVITIES)[number];

export const KEYBOARD_SWITCH_TYPES = ['Linear', 'Tactile', 'Clicky', 'Optical', 'Magnetic'] as const;
export type IKeyboardSwitchType = (typeof KEYBOARD_SWITCH_TYPES)[number];

export const KEYBOARD_SEARCHABLE_FIELDS = [...PRODUCT_SEARCHABLE_FIELDS, 'modelName', 'collab', 'series', 'switchType'] as const;
export type KeyboardSearchableFields = (typeof KEYBOARD_SEARCHABLE_FIELDS)[number];

export const KEYBOARD_SORTABLE_FIELDS = [...PRODUCT_SORTABLE_FIELDS, 'layout'] as const;
export type KeyboardSortableFields = (typeof KEYBOARD_SORTABLE_FIELDS)[number];

export const KEYBOARD_FILTERABLE_FIELDS = [...PRODUCT_FILTERABLE_FIELDS, 'caseMaterial', 'collab', 'connectivity', 'hotswap', 'layout', 'series', 'switchType', 'rapidTrigger', 'rgb'] as const;
export type KeyboardFilterableFields = (typeof KEYBOARD_FILTERABLE_FIELDS)[number];

export type KeyboardFilterCriteria = TFilterCriteria<KeyboardFilterableFields>;
export type KeyboardSortCriteria = TSortCriteria<KeyboardSortableFields>;
export type KeyboardSearchCriteria = ProductSearchCriteria;
