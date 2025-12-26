import type { DomainError } from "@backend/libs/error";

interface BaseWorkspaceError {
  readonly message: string;
}

export interface WorkspaceNotFoundError extends BaseWorkspaceError {
  readonly type: 'WORKSPACE_NOT_FOUND';
  readonly workspaceId: string;
}

export interface InvalidWorkspaceNameError extends BaseWorkspaceError {
  readonly type: 'INVALID_WORKSPACE_NAME';
  readonly invalidValue: string;
  readonly reason: string;
}

export interface InvalidWorkspaceRoleError extends BaseWorkspaceError {
  readonly type: 'INVALID_WORKSPACE_ROLE';
  readonly invalidValue: string;
  readonly reason: string;
}

export interface WorkspaceUserAlreadyExistsError extends BaseWorkspaceError {
  readonly type: 'WORKSPACE_USER_ALREADY_EXISTS';
  readonly userId: string;
  readonly workspaceId: string;
}

// TODO сделать юзкейс
export interface CannotModifyDeletedWorkspaceError extends BaseWorkspaceError {
  readonly type: 'WORKSPACE_CANNOT_MODIFY_DELETED';
  readonly workspaceId: string;
}

export interface InvalidRoleError extends BaseWorkspaceError {
	readonly type: 'INVALID_ROLE';
	readonly role: string;
	readonly reason: string;
}

export interface WorkspaceUserNotFoundError extends BaseWorkspaceError {
	readonly type: 'WORKSPACE_USER_NOT_FOUND';
	readonly userId: string;
	readonly workspaceId: string;
}

export interface NotPermissionToAddNewUseError extends BaseWorkspaceError {
	readonly type: 'NOT_PERMISSION_TO_ADD_NEW_USER_TO_WORKSPACE';
	readonly userId: string;
	readonly workspaceId: string;
}

export type WorkspaceDomainError = DomainError<
  | WorkspaceNotFoundError
  | InvalidWorkspaceNameError
  | InvalidWorkspaceRoleError
  | WorkspaceUserAlreadyExistsError
  | CannotModifyDeletedWorkspaceError
  | InvalidRoleError
  | WorkspaceUserNotFoundError
  | NotPermissionToAddNewUseError
>

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


export const createInvalidRoleError = (role: string, reason: string): InvalidRoleError => ({
	type: 'INVALID_ROLE',
	message: `Invalid role ${role}`,
	role,
	reason
});

export const createWorkspaceUserNotFoundError = (userId: string, workspaceId: string): WorkspaceUserNotFoundError => ({
	type: 'WORKSPACE_USER_NOT_FOUND',
	message: `User ${userId} not found in workspace ${workspaceId}`,
	userId,
	workspaceId,
});

export const createNotPermissionToAddNewUseError = (userId: string, workspaceId: string): NotPermissionToAddNewUseError => ({
	type: 'NOT_PERMISSION_TO_ADD_NEW_USER_TO_WORKSPACE',
	message: `User ${userId} not have permission to add new user to workspace ${workspaceId}`,
	userId,
	workspaceId,
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

export const isInvalidRoleError = (
	error: WorkspaceDomainError
): error is InvalidRoleError => error.type === 'INVALID_ROLE';

export const isWorkspaceUserNotFoundError = (
	error: WorkspaceDomainError
): error is WorkspaceUserNotFoundError => error.type === 'WORKSPACE_USER_NOT_FOUND';

export const isNotPermissionToAddNewUseError = (
	error: WorkspaceDomainError
): error is NotPermissionToAddNewUseError => error.type === 'NOT_PERMISSION_TO_ADD_NEW_USER_TO_WORKSPACE';

