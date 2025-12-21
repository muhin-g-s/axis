interface BaseProjectError {
  readonly message: string;
}

interface ProjectNotFoundError extends BaseProjectError {
  readonly type: 'PROJECT_NOT_FOUND';
  readonly projectId: string;
}

interface InvalidProjectNameError extends BaseProjectError {
  readonly type: 'INVALID_PROJECT_NAME';
  readonly invalidName: string;
}

interface OptimisticLockError extends BaseProjectError {
  readonly type: 'OPTIMISTIC_LOCK_ERROR';
  readonly projectId: string;
}

interface CannotModifyDeletedProjectError extends BaseProjectError {
  readonly type: 'CANNOT_MODIFY_DELETED_PROJECT';
  readonly projectId: string;
}

export interface InvalidObjectInDatabaseError extends BaseProjectError {
	readonly type: 'INVALID_OBJECT_IN_DATABASE';
	readonly object: unknown;
	readonly schemaName: string;
	readonly reason: string;
}

export interface UnexpectedDatabaseError extends BaseProjectError {
	readonly type: 'UNEXPECTED_DATABASE_ERROR';
	readonly error: unknown;
}

export type ProjectDomainError =
  | ProjectNotFoundError
  | InvalidProjectNameError
  | OptimisticLockError
  | CannotModifyDeletedProjectError
	| InvalidObjectInDatabaseError
	| UnexpectedDatabaseError;


export const createProjectNotFoundError = (projectId: string): ProjectNotFoundError => ({
  type: 'PROJECT_NOT_FOUND',
  message: `Project with ID ${projectId} not found`,
  projectId,
});

export const createInvalidProjectNameError = (invalidName: string): InvalidProjectNameError => ({
  type: 'INVALID_PROJECT_NAME',
  message: `Invalid project name: "${invalidName}"`,
  invalidName,
});

export const createOptimisticLockError = (projectId: string): OptimisticLockError => ({
  type: 'OPTIMISTIC_LOCK_ERROR',
  message: `Optimistic lock error: project ${projectId} was concurrently modified`,
  projectId,
});

export const createCannotModifyDeletedProjectError = (projectId: string): CannotModifyDeletedProjectError => ({
  type: 'CANNOT_MODIFY_DELETED_PROJECT',
  message: `Cannot modify project ${projectId} because it has been marked as deleted`,
  projectId,
});

export const createInvalidObjectInDatabaseError = (object: unknown, schemaName: string, reason: string): InvalidObjectInDatabaseError => ({
	type: 'INVALID_OBJECT_IN_DATABASE',
	message: `Invalid object in database: ${JSON.stringify(object)}, schema: ${schemaName}`,
	object,
	schemaName,
	reason
});

export const createUnexpectedDatabaseError = (error: unknown): UnexpectedDatabaseError => ({
	type: 'UNEXPECTED_DATABASE_ERROR',
	message: `Unexpected database error: ${JSON.stringify(error)}`,
	error,
});

export const isProjectNotFoundError = (
  error: ProjectDomainError
): error is ProjectNotFoundError => error.type === 'PROJECT_NOT_FOUND';

export const isInvalidProjectNameError = (
  error: ProjectDomainError
): error is InvalidProjectNameError => error.type === 'INVALID_PROJECT_NAME';

export const isOptimisticLockError = (
  error: ProjectDomainError
): error is OptimisticLockError => error.type === 'OPTIMISTIC_LOCK_ERROR';

export const isCannotModifyDeletedProjectError = (
  error: ProjectDomainError
): error is CannotModifyDeletedProjectError => error.type === 'CANNOT_MODIFY_DELETED_PROJECT';

export const isInvalidObjectInDatabaseError = (
	error: ProjectDomainError
): error is InvalidObjectInDatabaseError => error.type === 'INVALID_OBJECT_IN_DATABASE';

export const isUnexpectedDatabaseError = (
	error: ProjectDomainError
): error is UnexpectedDatabaseError => error.type === 'UNEXPECTED_DATABASE_ERROR';
