import { isNotDomainSpecificError } from "@backend/libs/error";
import { notDomainErrorToTRPC } from "@backend/libs/trpc";
import {
  isEntityNotFoundError,
  isCannotCreateEntityError,
  isCannotAccessWorkspaceConfigurationError,
  isCannotCreateWorkspaceConfigurationError,
  isCannotModifyWorkspaceConfigurationError,
  isCannotViewWorkspaceConfigurationError,
  type WorkspaceConfigurationDomainError,
  type EntityNotFoundError,
  type CannotCreateEntityError,
  type CannotAccessWorkspaceConfigurationError,
  type CannotCreateWorkspaceConfigurationError,
  type CannotModifyWorkspaceConfigurationError,
  type CannotViewWorkspaceConfigurationError,
	type InvalidLabelNameError,
	type InvalidPriorityLevelError,
	type InvalidPriorityNameError,
	type InvalidStatusNameError,
	type InvalidStatusOrderError,
	isInvalidLabelNameError,
	isInvalidPriorityLevelError,
	isInvalidPriorityNameError,
	isInvalidStatusNameError,
	isInvalidStatusOrderError,
} from "@backend/modules/workspace-configuration/domain/errors";
import { TRPCError } from "@trpc/server";
import { match } from "ts-pattern";

export function mapErr(err: WorkspaceConfigurationDomainError): TRPCError {
  return match(err)
    .when(isEntityNotFoundError, EntityNotFoundErrorToTRPC)
    .when(isCannotCreateEntityError, CannotCreateEntityErrorToTRPC)
    .when(isCannotAccessWorkspaceConfigurationError, CannotAccessWorkspaceConfigurationErrorToTRPC)
    .when(isCannotCreateWorkspaceConfigurationError, CannotCreateWorkspaceConfigurationErrorToTRPC)
    .when(isCannotModifyWorkspaceConfigurationError, CannotModifyWorkspaceConfigurationErrorToTRPC)
    .when(isCannotViewWorkspaceConfigurationError, CannotViewWorkspaceConfigurationErrorToTRPC)
    .when(isNotDomainSpecificError, notDomainErrorToTRPC)
		.when(isInvalidLabelNameError, InvalidLabelNameErrorToTRPC)
		.when(isInvalidPriorityLevelError, InvalidPriorityLevelErrorToTRPC)
		.when(isInvalidPriorityNameError, InvalidPriorityNameErrorToTRPC)
		.when(isInvalidStatusNameError, InvalidStatusNameErrorToTRPC)
		.when(isInvalidStatusOrderError, InvalidStatusOrderErrorToTRPC)
    .exhaustive();
}

function EntityNotFoundErrorToTRPC(err: EntityNotFoundError): TRPCError {
  return new TRPCError({
    code: 'NOT_FOUND',
    message: err.message,
    cause: { entity: err.entity, entityId: err.entityId },
  });
}

function CannotCreateEntityErrorToTRPC(err: CannotCreateEntityError): TRPCError {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: err.message,
    cause: { userId: err.userId, entity: err.entity },
  });
}

function CannotAccessWorkspaceConfigurationErrorToTRPC(
  err: CannotAccessWorkspaceConfigurationError,
): TRPCError {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: err.message,
    cause: { userId: err.userId },
  });
}

function CannotCreateWorkspaceConfigurationErrorToTRPC(
  err: CannotCreateWorkspaceConfigurationError,
): TRPCError {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: err.message,
    cause: { userId: err.userId },
  });
}

function CannotModifyWorkspaceConfigurationErrorToTRPC(
  err: CannotModifyWorkspaceConfigurationError,
): TRPCError {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: err.message,
    cause: { userId: err.userId },
  });
}

function CannotViewWorkspaceConfigurationErrorToTRPC(
  err: CannotViewWorkspaceConfigurationError,
): TRPCError {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: err.message,
    cause: { userId: err.userId },
  });
}

export function InvalidLabelNameErrorToTRPC(err: InvalidLabelNameError): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}

export function InvalidPriorityNameErrorToTRPC(err: InvalidPriorityNameError): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}

export function InvalidPriorityLevelErrorToTRPC(err: InvalidPriorityLevelError): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}

export function InvalidStatusNameErrorToTRPC(err: InvalidStatusNameError): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}

export function InvalidStatusOrderErrorToTRPC(err: InvalidStatusOrderError): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}
