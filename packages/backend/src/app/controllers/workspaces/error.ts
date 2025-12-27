import { isNotDomainSpecificError } from "@backend/libs/error";
import {
  notDomainErrorToTRPC,
  createBadRequestError,
  createNotFoundError,
  createConflictError,
  createForbiddenError
} from "@backend/libs/trpc";
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
import type { TRPCError } from "@trpc/server";
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
  return createBadRequestError(err);
}

export function InvalidWorkspaceRoleErrorToTRPC(err: InvalidWorkspaceRoleError): TRPCError {
  return createBadRequestError(err);
}

function WorkspaceUserAlreadyExistsErrorToTRPC(
  err: WorkspaceUserAlreadyExistsError,
): TRPCError {
  return createConflictError(err, { userId: err.userId, workspaceId: err.workspaceId });
}

function WorkspaceNotFoundErrorToTRPC(err: WorkspaceNotFoundError): TRPCError {
  return createNotFoundError(err, { workspaceId: err.workspaceId });
}

function CannotModifyDeletedWorkspaceErrorToTRPC(
  err: CannotModifyDeletedWorkspaceError,
): TRPCError {
  return createConflictError(err, { workspaceId: err.workspaceId });
}

export function InvalidRoleErrorToTRPC(
  err: InvalidRoleError,
): TRPCError {
  return createBadRequestError(err);
}

function WorkspaceUserNotFoundErrorToTRPC(
  err: WorkspaceUserNotFoundError,
): TRPCError {
  return createNotFoundError(err, { userId: err.userId, workspaceId: err.workspaceId });
}

function NotPermissionToAddNewUseErrorToTRPC(
  err: NotPermissionToAddNewUseError,
): TRPCError {
  return createForbiddenError(err, { userId: err.userId, workspaceId: err.workspaceId });
}
