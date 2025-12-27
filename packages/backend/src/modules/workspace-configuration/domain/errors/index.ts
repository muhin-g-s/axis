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

export interface InvalidLabelNameError extends BaseError {
	readonly type: 'INVALID_LABEL_NAME';
	readonly labelName: string;
	readonly reason: string;
}

export interface InvalidPriorityNameError extends BaseError {
	readonly type: 'INVALID_PRIORITY_NAME';
	readonly priorityName: string;
	readonly reason: string;
}

export interface InvalidPriorityLevelError extends BaseError {
	readonly type: 'INVALID_PRIORITY_LEVEL';
	readonly priorityLevel: number;
	readonly reason: string;
}

export interface InvalidStatusNameError extends BaseError {
	readonly type: 'INVALID_STATUS_NAME';
	readonly statusName: string;
	readonly reason: string;
}

export interface InvalidStatusOrderError extends BaseError {
	readonly type: 'INVALID_STATUS_ORDER';
	readonly statusOrder: number;
	readonly reason: string;
}

export type WorkspaceConfigurationDomainError = DomainError<
	| EntityNotFoundError
	| CannotCreateEntityError
	| CannotAccessWorkspaceConfigurationError
	| CannotCreateWorkspaceConfigurationError
	| CannotModifyWorkspaceConfigurationError
	| CannotViewWorkspaceConfigurationError
	| InvalidLabelNameError
	| InvalidPriorityNameError
	| InvalidPriorityLevelError
	| InvalidStatusNameError
	| InvalidStatusOrderError
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

export const createInvalidLabelNameError = (labelName: string, reason: string): InvalidLabelNameError => ({
	type: 'INVALID_LABEL_NAME',
	message: `Invalid label name ${labelName}`,
	labelName,
	reason
});

export const createInvalidPriorityNameError = (priorityName: string, reason: string): InvalidPriorityNameError => ({
	type: 'INVALID_PRIORITY_NAME',
	message: `Invalid priority name ${priorityName}`,
	priorityName,
	reason
});

export const createInvalidPriorityLevelError = (priorityLevel: number, reason: string): InvalidPriorityLevelError => ({
	type: 'INVALID_PRIORITY_LEVEL',
	message: `Invalid priority level ${priorityLevel}`,
	priorityLevel,
	reason
});

export const createInvalidStatusNameError = (statusName: string, reason: string): InvalidStatusNameError => ({
	type: 'INVALID_STATUS_NAME',
	message: `Invalid status name ${statusName}`,
	statusName,
	reason
});

export const createInvalidStatusOrderError = (statusOrder: number, reason: string): InvalidStatusOrderError => ({
	type: 'INVALID_STATUS_ORDER',
	message: `Invalid status order ${statusOrder}`,
	statusOrder,
	reason
});

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

export const isInvalidLabelNameError = (
	error: WorkspaceConfigurationDomainError
): error is InvalidLabelNameError => error.type === 'INVALID_LABEL_NAME';

export const isInvalidPriorityNameError = (
	error: WorkspaceConfigurationDomainError
): error is InvalidPriorityNameError => error.type === 'INVALID_PRIORITY_NAME';

export const isInvalidPriorityLevelError = (
	error: WorkspaceConfigurationDomainError
): error is InvalidPriorityLevelError => error.type === 'INVALID_PRIORITY_LEVEL';

export const isInvalidStatusNameError = (
	error: WorkspaceConfigurationDomainError
): error is InvalidStatusNameError => error.type === 'INVALID_STATUS_NAME';

export const isInvalidStatusOrderError = (
	error: WorkspaceConfigurationDomainError
): error is InvalidStatusOrderError => error.type === 'INVALID_STATUS_ORDER';