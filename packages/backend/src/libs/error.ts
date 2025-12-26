interface BaseError {
  readonly message: string;
	readonly type: string
}

export interface InvalidObjectInDatabaseError extends BaseError {
	readonly type: 'INVALID_OBJECT_IN_DATABASE';
	readonly object: unknown;
	readonly schemaName: string;
	readonly reason: string;
}

export interface UnexpectedDatabaseError extends BaseError {
	readonly type: 'UNEXPECTED_DATABASE_ERROR';
	readonly error: unknown;
}

export interface UnexpectedError extends BaseError {
	readonly type: 'UNEXPECTED_ERROR';
	readonly error: unknown;
}

export type NotDomainSpecificError =
	| InvalidObjectInDatabaseError
	| UnexpectedDatabaseError
	| UnexpectedError;

export type DomainError<DomainSpecificError extends BaseError> = DomainSpecificError | NotDomainSpecificError;

export const createInvalidObjectInDatabaseError = (object: unknown, schemaName: string, reason: string): InvalidObjectInDatabaseError => ({
	type: 'INVALID_OBJECT_IN_DATABASE',
	message: `Invalid object in database: ${JSON.stringify(object)}, schema: ${schemaName}`,
	object,
	schemaName,
	reason
});

export const createUnexpectedDatabaseError = (error: unknown): UnexpectedDatabaseError => ({
	type: 'UNEXPECTED_DATABASE_ERROR',
	message: 'Unexpected database error',
	error,
});

export const createUnexpectedError = (error: unknown): UnexpectedError => ({
	type: 'UNEXPECTED_ERROR',
	message: 'Unexpected error',
	error,
});

export const isInvalidObjectInDatabaseError = (
	error: NotDomainSpecificError
): error is InvalidObjectInDatabaseError => error.type === 'INVALID_OBJECT_IN_DATABASE';

export const isUnexpectedDatabaseError = (
	error: NotDomainSpecificError
): error is UnexpectedDatabaseError =>
	error.type === 'UNEXPECTED_DATABASE_ERROR';

export const isUnexpectedError = (
	error: NotDomainSpecificError
): error is UnexpectedError => error.type === 'UNEXPECTED_ERROR';

export const isNotDomainSpecificError = <T extends BaseError>(
	error: DomainError<T>
): error is NotDomainSpecificError =>
	error.type === 'INVALID_OBJECT_IN_DATABASE' ||
	error.type === 'UNEXPECTED_DATABASE_ERROR' ||
	error.type === 'UNEXPECTED_ERROR';
