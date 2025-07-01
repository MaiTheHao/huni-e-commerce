import mongoose from 'mongoose';
import { IProductBase, PRODUCT_FILTERABLE_FIELDS, PRODUCT_SEARCHABLE_FIELDS, PRODUCT_SORTABLE_FIELDS, ProductSearchCriteria } from './product.entity';
import { TFilterCriteria, TSortCriteria } from '@/interfaces';
import { ISwitchType } from './switch.entity';

export interface IKeyboardBase extends IProductBase {
	caseMaterial: string;
	collab: string | null;
	connectivity: TKeyboardConnectivity[];
	hotswap: boolean;
	layout: TKeyboardLayout;
	modelName: string;
	rapidTrigger: boolean;
	rgb: boolean;
	series: string | null;
	switchType: ISwitchType;
}

export interface IKeyboard extends IKeyboardBase {
	_id: string;
}

export interface IKeyboardDocument extends IKeyboardBase, mongoose.Document<mongoose.Types.ObjectId> {}

export const KEYBOARD_LAYOUTS = ['Fullsize', '96%', 'TKL', '75%', '65%', '60%'] as const;
export type TKeyboardLayout = (typeof KEYBOARD_LAYOUTS)[number];

export const KEYBOARD_CONNECTIVITIES = ['Type-C', 'Bluetooth', '2.4GHz', 'USB-A'] as const;
export type TKeyboardConnectivity = (typeof KEYBOARD_CONNECTIVITIES)[number];

export const KEYBOARD_SEARCHABLE_FIELDS = [...PRODUCT_SEARCHABLE_FIELDS, 'modelName', 'collab', 'series', 'switchType'] as const;
export type TKeyboardSearchableFields = (typeof KEYBOARD_SEARCHABLE_FIELDS)[number];

export const KEYBOARD_SORTABLE_FIELDS = [...PRODUCT_SORTABLE_FIELDS, 'layout'] as const;
export type TKeyboardSortableFields = (typeof KEYBOARD_SORTABLE_FIELDS)[number];

export const KEYBOARD_FILTERABLE_FIELDS = [...PRODUCT_FILTERABLE_FIELDS, 'caseMaterial', 'collab', 'connectivity', 'hotswap', 'layout', 'series', 'switchType', 'rapidTrigger', 'rgb'] as const;
export type TKeyboardFilterableFields = (typeof KEYBOARD_FILTERABLE_FIELDS)[number];

export type TKeyboardFilterCriteria = TFilterCriteria<TKeyboardFilterableFields>;
export type TKeyboardSortCriteria = TSortCriteria<TKeyboardSortableFields>;
export type TKeyboardSearchCriteria = ProductSearchCriteria;
