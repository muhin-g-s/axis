import type { DomainError } from "@backend/libs/error";

type Entity = 'priority' | 'label' | 'status';

interface BaseError {
  readonly message: string;
}

export interface EntityNotFoundError extends BaseError {
	readonly type: 'ENTITY_NOT_FOUND';
	readonly entity: Entity;
	readonly entityId: string;
}

export interface CannotCreateEntityError extends BaseError {
	readonly type: 'CANNOT_CREATE_ENTITY';
	readonly userId: string;
	readonly entity: Entity;
}

export interface CannotAccessWorkspaceConfigurationError extends BaseError {
	readonly type: 'CANNOT_ACCESS_WORKSPACE_CONFIGURATION';
	readonly userId: string;
}

export interface CannotCreateWorkspaceConfigurationError extends BaseError {
	readonly type: 'CANNOT_CREATE_WORKSPACE_CONFIGURATION';
	readonly userId: string;
}

export interface CannotModifyWorkspaceConfigurationError extends BaseError {
	readonly type: 'CANNOT_MODIFY_WORKSPACE_CONFIGURATION';
	readonly userId: string;
}

export interface CannotViewWorkspaceConfigurationError extends BaseError {
	readonly type: 'CANNOT_VIEW_WORKSPACE_CONFIGURATION';
	readonly userId: string;
}

export type WorkspaceConfigurationDomainError = DomainError<
	| EntityNotFoundError
	| CannotCreateEntityError
	| CannotAccessWorkspaceConfigurationError
	| CannotCreateWorkspaceConfigurationError
	| CannotModifyWorkspaceConfigurationError
	| CannotViewWorkspaceConfigurationError
>

export const createEntityNotFoundError = (entity: Entity, entityId: string): EntityNotFoundError => ({
	type: 'ENTITY_NOT_FOUND',
	message: `Entity ${entity} with id ${entityId} not found`,
	entity,
	entityId,
});

export const createCannotCreateEntityError = (userId: string, entity: Entity): CannotCreateEntityError => ({
	type: 'CANNOT_CREATE_ENTITY',
	message: `Cannot create ${entity} because user ${userId} is not a member of any workspace`,
	userId,
	entity,
});

export const createCannotAccessWorkspaceConfigurationError = (userId: string): CannotAccessWorkspaceConfigurationError => ({
	type: 'CANNOT_ACCESS_WORKSPACE_CONFIGURATION',
	message: `Cannot access workspace configuration because user ${userId} is not a member of any workspace`,
	userId
})

export const createCannotCreateWorkspaceConfigurationError = (userId: string): CannotCreateWorkspaceConfigurationError => ({
	type: 'CANNOT_CREATE_WORKSPACE_CONFIGURATION',
	message: `Cannot create workspace configuration because user ${userId} is not a member of any workspace`,
	userId
})

export const createCannotModifyWorkspaceConfigurationError = (userId: string): CannotModifyWorkspaceConfigurationError => ({
	type: 'CANNOT_MODIFY_WORKSPACE_CONFIGURATION',
	message: `Cannot modify workspace configuration because user ${userId} is not a member of any workspace`,
	userId
})

export const createCannotViewWorkspaceConfigurationError = (userId: string): CannotViewWorkspaceConfigurationError => ({
	type: 'CANNOT_VIEW_WORKSPACE_CONFIGURATION',
	message: `Cannot view workspace configuration because user ${userId} is not a member of any workspace`,
	userId
})

export const isEntityNotFoundError = (
	error: WorkspaceConfigurationDomainError
): error is EntityNotFoundError => error.type === 'ENTITY_NOT_FOUND';

export const isCannotCreateEntityError = (
	error: WorkspaceConfigurationDomainError
): error is CannotCreateEntityError => error.type === 'CANNOT_CREATE_ENTITY';

export const isCannotAccessWorkspaceConfigurationError = (
	error: WorkspaceConfigurationDomainError
): error is CannotAccessWorkspaceConfigurationError => error.type === 'CANNOT_ACCESS_WORKSPACE_CONFIGURATION';

export const isCannotCreateWorkspaceConfigurationError = (
	error: WorkspaceConfigurationDomainError
): error is CannotCreateWorkspaceConfigurationError => error.type === 'CANNOT_CREATE_WORKSPACE_CONFIGURATION';

export const isCannotModifyWorkspaceConfigurationError = (
	error: WorkspaceConfigurationDomainError
): error is CannotModifyWorkspaceConfigurationError => error.type === 'CANNOT_MODIFY_WORKSPACE_CONFIGURATION';

export const isCannotViewWorkspaceConfigurationError = (
	error: WorkspaceConfigurationDomainError
): error is CannotViewWorkspaceConfigurationError => error.type === 'CANNOT_VIEW_WORKSPACE_CONFIGURATION';
