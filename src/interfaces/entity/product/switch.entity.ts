import mongoose from 'mongoose';
import { TFilterCriteria, TSortCriteria } from '@/interfaces';
import { IProductBase, PRODUCT_FILTERABLE_FIELDS, PRODUCT_SEARCHABLE_FIELDS, PRODUCT_SORTABLE_FIELDS, ProductSearchCriteria } from './product.entity';

export const SWITCH_TYPES = ['Linear', 'Tactile', 'Clicky', 'Optical', 'Magnetic'] as const;
export type ISwitchType = (typeof SWITCH_TYPES)[number];

export const SWITCH_MOUNT_TYPES = ['Plate Mount', 'PCB Mount'] as const;
export type ISwitchMountType = (typeof SWITCH_MOUNT_TYPES)[number];

export const SWITCH_ACTUATION_FORCES = ['35g', '40g', '45g', '50g', '55g', '60g', '62g', '65g', '67g', '70g', '75g', '80g'] as const;
export type ISwitchActuationForce = (typeof SWITCH_ACTUATION_FORCES)[number];

export interface ISwitchBase extends IProductBase {
	switchType: ISwitchType;
	mountType: ISwitchMountType;
	actuationForce: ISwitchActuationForce;
	travelDistance: number;
	stemMaterial: string;
	housingMaterial: string;
	ledSupport: boolean;
	factoryLubed: boolean;
	modelName: string;
	collab: string | null;
	series: string | null;
}

export interface ISwitch extends ISwitchBase {
	_id: string;
}

export interface ISwitchDocument extends ISwitchBase, mongoose.Document<mongoose.Types.ObjectId> {}

export const SWITCH_SEARCHABLE_FIELDS = [...PRODUCT_SEARCHABLE_FIELDS, 'modelName', 'collab', 'series', 'switchType', 'mountType', 'stemMaterial', 'housingMaterial'] as const;
export type SwitchSearchableFields = (typeof SWITCH_SEARCHABLE_FIELDS)[number];

export const SWITCH_SORTABLE_FIELDS = [...PRODUCT_SORTABLE_FIELDS, 'actuationForce', 'travelDistance', 'modelName'] as const;
export type SwitchSortableFields = (typeof SWITCH_SORTABLE_FIELDS)[number];

export const SWITCH_FILTERABLE_FIELDS = [
	...PRODUCT_FILTERABLE_FIELDS,
	'switchType',
	'mountType',
	'actuationForce',
	'travelDistance',
	'stemMaterial',
	'housingMaterial',
	'ledSupport',
	'factoryLubed',
	'modelName',
	'collab',
	'series',
] as const;
export type SwitchFilterableFields = (typeof SWITCH_FILTERABLE_FIELDS)[number];

export type SwitchFilterCriteria = TFilterCriteria<SwitchFilterableFields>;
export type SwitchSortCriteria = TSortCriteria<SwitchSortableFields>;
export type SwitchSearchCriteria = ProductSearchCriteria;
