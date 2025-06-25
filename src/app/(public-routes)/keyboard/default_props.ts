import { IPagination, IProductFilter } from '@/interfaces';

export const DEFAULT_KEYBOARD_PAGINATION: IPagination = {
	page: 1,
	limit: 12,
	total: 0,
	totalPages: 0,
};
export const DEFAULT_KEYBOARD_FILTER: IProductFilter = {
	_id: 'fakle-id-keyboard-filter',
	productType: 'keyboard',
	fields: [
		{
			fieldName: 'price',
			type: 'range',
			label: 'Giá',
			filterable: true,
			sortable: true,
			options: [0, 5000000],
			sortType: 'num',
		},
		{
			fieldName: 'caseMaterial',
			type: 'string',
			label: 'Chất liệu vỏ',
			options: [
				{ value: 'ABS', label: 'ABS' },
				{ value: 'Aluminum', label: 'Aluminum' },
				{ value: 'PBT', label: 'PBT' },
				{ value: 'PBT + ABS', label: 'PBT + ABS' },
				{ value: 'Plastic', label: 'Plastic' },
				{ value: 'Polycarbonate', label: 'Polycarbonate' },
				{ value: 'Walnut Wood', label: 'Gỗ óc chó' },
			],
			filterable: true,
			sortable: false,
		},
		{
			fieldName: 'connectivity',
			type: 'string',
			label: 'Kết nối',
			options: [
				{ value: '2.4GHz', label: '2.4GHz' },
				{ value: 'Bluetooth', label: 'Bluetooth' },
				{ value: 'Type-C', label: 'Type-C' },
			],
			filterable: true,
			sortable: false,
		},
		{
			fieldName: 'layout',
			type: 'string',
			label: 'Layout',
			options: [
				{ value: '60%', label: '60%' },
				{ value: '65%', label: '65%' },
				{ value: '75%', label: '75%' },
				{ value: '96%', label: '96%' },
				{ value: 'TKL', label: 'TKL' },
				{ value: 'Fullsize', label: 'Fullsize' },
			],
			filterable: true,
			sortable: true,
			sortType: 'custom',
			customSortOrder: ['60%', '65%', '75%', '96%', 'TKL', 'Fullsize'],
		},
		{
			fieldName: 'switchType',
			type: 'string',
			label: 'Loại switch',
			options: [
				{ value: 'Linear', label: 'Linear' },
				{ value: 'Linear / Tactile', label: 'Linear / Tactile' },
				{ value: 'Magnetic Linear', label: 'Magnetic Linear' },
			],
			filterable: true,
			sortable: false,
		},
	],
	createdAt: new Date(),
	updatedAt: new Date(),
};
