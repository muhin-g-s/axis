import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidPriorityNameError, type InvalidPriorityNameError } from '../errors';

export const PriorityNameSchema = type('string >= 1').brand('PriorityName');
export type PriorityName = typeof PriorityNameSchema.infer;

export function createPriorityName(name: string): Result<PriorityName, InvalidPriorityNameError> {
	return validate<PriorityName, InvalidPriorityNameError>(
		PriorityNameSchema,
		name,
		msg => createInvalidPriorityNameError(name, msg)
	);
}

export function priorityNameEquals(a: PriorityName, b: PriorityName): boolean {
	return a === b;
}
