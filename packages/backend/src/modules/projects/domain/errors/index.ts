import type { DomainError } from "@backend/libs/error";

interface BaseProjectError {
  readonly message: string;
}

export interface ProjectNotFoundError extends BaseProjectError {
  readonly type: 'PROJECT_NOT_FOUND';
  readonly projectId: string;
}

export interface InvalidProjectNameError extends BaseProjectError {
  readonly type: 'INVALID_PROJECT_NAME';
  readonly invalidName: string;
}

export interface OptimisticLockError extends BaseProjectError {
  readonly type: 'OPTIMISTIC_LOCK_ERROR';
  readonly projectId: string;
}

export interface CannotModifyDeletedProjectError extends BaseProjectError {
  readonly type: 'CANNOT_MODIFY_DELETED_PROJECT';
  readonly projectId: string;
}

export interface CannotCreateProjectError extends BaseProjectError {
	readonly type: 'CANNOT_CREATE_PROJECT';
	readonly userId: string;
}

export interface CannotDeleteProjectError extends BaseProjectError {
	readonly type: 'CANNOT_DELETE_PROJECT';
	readonly userId: string;
}

export interface CannotModifyProjectError extends BaseProjectError {
	readonly type: 'CANNOT_MODIFY_PROJECT';
	readonly userId: string;
}

export interface CannotViewProjectError extends BaseProjectError {
	readonly type: 'CANNOT_VIEW_PROJECT';
	readonly userId: string;
}

export interface CannotAccessProjectError extends BaseProjectError {
	readonly type: 'CANNOT_ACCESS_PROJECT';
	readonly userId: string;
}

export type ProjectDomainError = DomainError<
  | ProjectNotFoundError
  | InvalidProjectNameError
  | OptimisticLockError
  | CannotModifyDeletedProjectError
  | CannotCreateProjectError
  | CannotDeleteProjectError
  | CannotModifyProjectError
  | CannotViewProjectError
  | CannotAccessProjectError
>


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


export const createCannotCreateProjectError = (userId: string): CannotCreateProjectError => ({
	type: 'CANNOT_CREATE_PROJECT',
	message: `Cannot create project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotDeleteProjectError = (userId: string): CannotDeleteProjectError => ({
	type: 'CANNOT_DELETE_PROJECT',
	message: `Cannot delete project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotModifyProjectError = (userId: string): CannotModifyProjectError => ({
	type: 'CANNOT_MODIFY_PROJECT',
	message: `Cannot modify project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotViewProjectError = (userId: string): CannotViewProjectError => ({
	type: 'CANNOT_VIEW_PROJECT',
	message: `Cannot view project because user ${userId} is not a member of any workspace`,
	userId,
});

export const createCannotAccessProjectError = (userId: string): CannotAccessProjectError => ({
	type: 'CANNOT_ACCESS_PROJECT',
	message: `Cannot access project because user ${userId} is not a member of any workspace`,
	userId,
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

export const isCannotCreateProjectError = (
	error: ProjectDomainError
): error is CannotCreateProjectError => error.type === 'CANNOT_CREATE_PROJECT';

export const isCannotDeleteProjectError = (
	error: ProjectDomainError
): error is CannotDeleteProjectError => error.type === 'CANNOT_DELETE_PROJECT';

export const isCannotModifyProjectError = (
	error: ProjectDomainError
): error is CannotModifyProjectError => error.type === 'CANNOT_MODIFY_PROJECT';

export const isCannotViewProjectError = (
	error: ProjectDomainError
): error is CannotViewProjectError => error.type === 'CANNOT_VIEW_PROJECT';

export const isCannotAccessProjectError = (
	error: ProjectDomainError
): error is CannotAccessProjectError => error.type === 'CANNOT_ACCESS_PROJECT';
