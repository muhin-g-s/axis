import { isNotDomainSpecificError } from "@backend/libs/error";
import { notDomainErrorToTRPC } from "@backend/libs/trpc";
import {
  isWorkspaceNotFoundError,
  isInvalidWorkspaceNameError,
  isInvalidWorkspaceRoleError,
  isWorkspaceUserAlreadyExistsError,
  isCannotModifyDeletedWorkspaceError,
  isInvalidRoleError,
  isWorkspaceUserNotFoundError,
  isNotPermissionToAddNewUseError,
  type WorkspaceDomainError,
  type WorkspaceNotFoundError,
  type InvalidWorkspaceNameError,
  type InvalidWorkspaceRoleError,
  type WorkspaceUserAlreadyExistsError,
  type CannotModifyDeletedWorkspaceError,
  type InvalidRoleError,
  type WorkspaceUserNotFoundError,
  type NotPermissionToAddNewUseError,
} from "@backend/modules/workspaces/domain/errors";
import { TRPCError } from "@trpc/server";
import { match } from "ts-pattern";

export function mapErr(err: WorkspaceDomainError): TRPCError {
  return match(err)
    .when(isInvalidWorkspaceNameError, InvalidWorkspaceNameErrorToTRPC)
    .when(isInvalidWorkspaceRoleError, InvalidWorkspaceRoleErrorToTRPC)
    .when(isWorkspaceUserAlreadyExistsError, WorkspaceUserAlreadyExistsErrorToTRPC)
    .when(isWorkspaceNotFoundError, WorkspaceNotFoundErrorToTRPC)
    .when(isCannotModifyDeletedWorkspaceError, CannotModifyDeletedWorkspaceErrorToTRPC)
    .when(isInvalidRoleError, InvalidRoleErrorToTRPC)
    .when(isWorkspaceUserNotFoundError, WorkspaceUserNotFoundErrorToTRPC)
    .when(isNotPermissionToAddNewUseError, NotPermissionToAddNewUseErrorToTRPC)
    .when(isNotDomainSpecificError, notDomainErrorToTRPC)
    .exhaustive();
}

export function InvalidWorkspaceNameErrorToTRPC(err: InvalidWorkspaceNameError): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}

export function InvalidWorkspaceRoleErrorToTRPC(err: InvalidWorkspaceRoleError): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}

function WorkspaceUserAlreadyExistsErrorToTRPC(
  err: WorkspaceUserAlreadyExistsError,
): TRPCError {
  return new TRPCError({
    code: 'CONFLICT',
    message: err.message,
    cause: { userId: err.userId, workspaceId: err.workspaceId },
  });
}

function WorkspaceNotFoundErrorToTRPC(err: WorkspaceNotFoundError): TRPCError {
  return new TRPCError({
    code: 'NOT_FOUND',
    message: err.message,
    cause: { workspaceId: err.workspaceId },
  });
}

function CannotModifyDeletedWorkspaceErrorToTRPC(
  err: CannotModifyDeletedWorkspaceError,
): TRPCError {
  return new TRPCError({
    code: 'CONFLICT',
    message: err.message,
    cause: { workspaceId: err.workspaceId },
  });
}

export function InvalidRoleErrorToTRPC(
  err: InvalidRoleError,
): TRPCError {
  return new TRPCError({
    code: 'BAD_REQUEST',
    message: err.message,
    cause: err.reason,
  });
}

function WorkspaceUserNotFoundErrorToTRPC(
  err: WorkspaceUserNotFoundError,
): TRPCError {
  return new TRPCError({
    code: 'NOT_FOUND',
    message: err.message,
    cause: { userId: err.userId, workspaceId: err.workspaceId },
  });
}

function NotPermissionToAddNewUseErrorToTRPC(
  err: NotPermissionToAddNewUseError,
): TRPCError {
  return new TRPCError({
    code: 'FORBIDDEN',
    message: err.message,
    cause: { userId: err.userId, workspaceId: err.workspaceId },
  });
}
