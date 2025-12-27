import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidStatusNameError, type InvalidStatusNameError } from '../errors';

export const StatusNameSchema = type('string >= 1').brand('StatusName');
export type StatusName = typeof StatusNameSchema.infer;

export function createStatusName(name: string): Result<StatusName, InvalidStatusNameError> {
	return validate<StatusName, InvalidStatusNameError>(
		StatusNameSchema,
		name,
		msg => createInvalidStatusNameError(name, msg)
	);
}

export function statusNameEquals(a: StatusName, b: StatusName): boolean {
	return a === b;
}
