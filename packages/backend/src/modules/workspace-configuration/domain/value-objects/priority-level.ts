import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidPriorityLevelError, type InvalidPriorityLevelError } from '../errors';

export const PriorityLevelSchema = type('number.integer > 0').brand('PriorityLevel');
export type PriorityLevel = typeof PriorityLevelSchema.infer;

export function createPriorityLevel(level: number): Result<PriorityLevel, InvalidPriorityLevelError> {
	return validate<PriorityLevel, InvalidPriorityLevelError>(
		PriorityLevelSchema,
		level,
		msg => createInvalidPriorityLevelError(level, msg)
	);
}

export function priorityLevelEquals(a: PriorityLevel, b: PriorityLevel): boolean {
	return a === b;
}
