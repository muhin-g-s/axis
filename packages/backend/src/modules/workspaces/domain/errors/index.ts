interface BaseWorkspaceError {
  readonly message: string;
}

interface WorkspaceNotFoundError extends BaseWorkspaceError {
  readonly type: 'WORKSPACE_NOT_FOUND';
  readonly workspaceId: string;
}

interface InvalidWorkspaceNameError extends BaseWorkspaceError {
  readonly type: 'INVALID_WORKSPACE_NAME';
  readonly invalidValue: string;
  readonly reason: string;
}

interface InvalidWorkspaceRoleError extends BaseWorkspaceError {
  readonly type: 'INVALID_WORKSPACE_ROLE';
  readonly invalidValue: string;
  readonly reason: string;
}

interface WorkspaceUserAlreadyExistsError extends BaseWorkspaceError {
  readonly type: 'WORKSPACE_USER_ALREADY_EXISTS';
  readonly userId: string;
  readonly workspaceId: string;
}

// TODO сделать юзкейс
interface CannotModifyDeletedWorkspaceError extends BaseWorkspaceError {
  readonly type: 'WORKSPACE_CANNOT_MODIFY_DELETED';
  readonly workspaceId: string;
}

interface InvalidObjectInDatabaseError extends BaseWorkspaceError {
  readonly type: 'INVALID_OBJECT_IN_DATABASE';
  readonly object: unknown;
  readonly schemaName: string;
  readonly reason: string;
}

interface UnexpectedDatabaseError extends BaseWorkspaceError {
  readonly type: 'UNEXPECTED_DATABASE_ERROR';
  readonly error: unknown;
}

export interface InvalidRoleError extends BaseWorkspaceError {
	readonly type: 'INVALID_ROLE';
	readonly role: string;
	readonly reason: string;
}

export type WorkspaceDomainError =
  | WorkspaceNotFoundError
  | InvalidWorkspaceNameError
  | InvalidWorkspaceRoleError
  | WorkspaceUserAlreadyExistsError
  | CannotModifyDeletedWorkspaceError
  | InvalidObjectInDatabaseError
  | UnexpectedDatabaseError
	| InvalidRoleError;

export const createWorkspaceNotFoundError = (workspaceId: string): WorkspaceNotFoundError => ({
  type: 'WORKSPACE_NOT_FOUND',
  message: `Workspace with ID ${workspaceId} not found`,
  workspaceId,
});

export const createInvalidWorkspaceNameError = (invalidValue: string, reason: string): InvalidWorkspaceNameError => ({
  type: 'INVALID_WORKSPACE_NAME',
  message: `Invalid workspace name: "${invalidValue}", reason: ${reason}`,
  invalidValue,
  reason,
});

export const createInvalidWorkspaceRoleError = (invalidValue: string, reason: string): InvalidWorkspaceRoleError => ({
  type: 'INVALID_WORKSPACE_ROLE',
  message: `Invalid workspace role: "${invalidValue}", reason: ${reason}`,
  invalidValue,
  reason,
});

export const createWorkspaceUserAlreadyExistsError = (userId: string, workspaceId: string): WorkspaceUserAlreadyExistsError => ({
  type: 'WORKSPACE_USER_ALREADY_EXISTS',
  message: `User ${userId} is already added to workspace ${workspaceId}`,
  userId,
  workspaceId,
});

export const createCannotModifyDeletedWorkspaceError = (workspaceId: string): CannotModifyDeletedWorkspaceError => ({
  type: 'WORKSPACE_CANNOT_MODIFY_DELETED',
  message: `Cannot modify deleted workspace ${workspaceId}`,
  workspaceId,
});

export const createInvalidObjectInDatabaseError = (
  object: unknown,
  schemaName: string,
  reason: string
): InvalidObjectInDatabaseError => ({
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

export const createInvalidRoleError = (role: string, reason: string): InvalidRoleError => ({
	type: 'INVALID_ROLE',
	message: `Invalid role ${role}`,
	role,
	reason
});

export const isWorkspaceNotFoundError = (
  error: WorkspaceDomainError
): error is WorkspaceNotFoundError => error.type === 'WORKSPACE_NOT_FOUND';

export const isInvalidWorkspaceNameError = (
  error: WorkspaceDomainError
): error is InvalidWorkspaceNameError => error.type === 'INVALID_WORKSPACE_NAME';

export const isInvalidWorkspaceRoleError = (
  error: WorkspaceDomainError
): error is InvalidWorkspaceRoleError => error.type === 'INVALID_WORKSPACE_ROLE';

export const isWorkspaceUserAlreadyExistsError = (
  error: WorkspaceDomainError
): error is WorkspaceUserAlreadyExistsError => error.type === 'WORKSPACE_USER_ALREADY_EXISTS';

export const isCannotModifyDeletedWorkspaceError = (
  error: WorkspaceDomainError
): error is CannotModifyDeletedWorkspaceError => error.type === 'WORKSPACE_CANNOT_MODIFY_DELETED';

export const isInvalidObjectInDatabaseError = (
  error: WorkspaceDomainError
): error is InvalidObjectInDatabaseError => error.type === 'INVALID_OBJECT_IN_DATABASE';

export const isUnexpectedDatabaseError = (
  error: WorkspaceDomainError
): error is UnexpectedDatabaseError => error.type === 'UNEXPECTED_DATABASE_ERROR';

export const isInvalidRoleError = (
	error: WorkspaceDomainError
): error is InvalidRoleError => error.type === 'INVALID_ROLE';
