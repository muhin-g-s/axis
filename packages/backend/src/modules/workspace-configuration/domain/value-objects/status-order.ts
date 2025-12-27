import { type } from 'arktype';
import { validate } from '@backend/libs/validation';
import { type Result } from '@backend/libs/result';
import { createInvalidStatusOrderError, type InvalidStatusOrderError } from '../errors';

export const StatusOrderSchema = type('number.integer > 0').brand('StatusOrder');
export type StatusOrder = typeof StatusOrderSchema.infer;

export function createStatusOrder(order: number): Result<StatusOrder, InvalidStatusOrderError> {
	return validate<StatusOrder, InvalidStatusOrderError>(
		StatusOrderSchema,
		order,
		msg => createInvalidStatusOrderError(order, msg)
	);
}

export function statusOrderEquals(a: StatusOrder, b: StatusOrder): boolean {
	return a === b;
}
