import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidLabelNameError, type InvalidLabelNameError } from '../errors';

export const LabelNameSchema = type('string >= 1').brand('LabelName');
export type LabelName = typeof LabelNameSchema.infer;

export function createLabelName(name: string): Result<LabelName, InvalidLabelNameError> {
	return validate<LabelName, InvalidLabelNameError>(LabelNameSchema, name, msg => createInvalidLabelNameError(name, msg));
}

export function labelNameEquals(a: LabelName, b: LabelName): boolean {
	return a === b;
}