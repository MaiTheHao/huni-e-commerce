import { extractType } from './convert/cast-type.util';

export function isEmpty(value: any): boolean {
	const type = extractType(value);
	if (type.isNull || type.isUndefined) return true;
	if (type.isString || type.isArray) return (value as any).length === 0;
	if (type.isObject) return Object.keys(value).length === 0;
	if (type.isNumber) return value === 0;
	return false;
}
