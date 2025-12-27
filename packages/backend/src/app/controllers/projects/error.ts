import { isNotDomainSpecificError } from "@backend/libs/error";
import {
  notDomainErrorToTRPC,
  createBadRequestError,
  createNotFoundError,
  createConflictError,
  createForbiddenError
} from "@backend/libs/trpc";
import {
  isProjectNotFoundError,
  isInvalidProjectNameError,
  isOptimisticLockError,
  isCannotModifyDeletedProjectError,
  isCannotCreateProjectError,
  isCannotDeleteProjectError,
  isCannotModifyProjectError,
  isCannotViewProjectError,
  isCannotAccessProjectError,
  type ProjectDomainError,
  type ProjectNotFoundError,
  type InvalidProjectNameError,
  type OptimisticLockError,
  type CannotModifyDeletedProjectError,
  type CannotCreateProjectError,
  type CannotDeleteProjectError,
  type CannotModifyProjectError,
  type CannotViewProjectError,
  type CannotAccessProjectError,
} from "@backend/modules/projects/domain/errors";
import type { TRPCError } from "@trpc/server";
import { match } from "ts-pattern";

export function mapErr(err: ProjectDomainError): TRPCError {
  return match(err)
    .when(isProjectNotFoundError, ProjectNotFoundErrorToTRPC)
    .when(isInvalidProjectNameError, InvalidProjectNameErrorToTRPC)
    .when(isOptimisticLockError, OptimisticLockErrorToTRPC)
    .when(isCannotModifyDeletedProjectError, CannotModifyDeletedProjectErrorToTRPC)
    .when(isCannotCreateProjectError, CannotCreateProjectErrorToTRPC)
    .when(isCannotDeleteProjectError, CannotDeleteProjectErrorToTRPC)
    .when(isCannotModifyProjectError, CannotModifyProjectErrorToTRPC)
    .when(isCannotViewProjectError, CannotViewProjectErrorToTRPC)
    .when(isCannotAccessProjectError, CannotAccessProjectErrorToTRPC)
    .when(isNotDomainSpecificError, notDomainErrorToTRPC)
    .exhaustive();
}

export function ProjectNotFoundErrorToTRPC(err: ProjectNotFoundError): TRPCError {
  return createNotFoundError(err);
}

export function InvalidProjectNameErrorToTRPC(err: InvalidProjectNameError): TRPCError {
  return createBadRequestError(err);
}

export function OptimisticLockErrorToTRPC(err: OptimisticLockError): TRPCError {
  return createConflictError(err);
}

export function CannotModifyDeletedProjectErrorToTRPC(err: CannotModifyDeletedProjectError): TRPCError {
  return createBadRequestError(err);
}

export function CannotCreateProjectErrorToTRPC(err: CannotCreateProjectError): TRPCError {
  return createForbiddenError(err);
}

export function CannotDeleteProjectErrorToTRPC(err: CannotDeleteProjectError): TRPCError {
  return createForbiddenError(err);
}

export function CannotModifyProjectErrorToTRPC(err: CannotModifyProjectError): TRPCError {
  return createForbiddenError(err);
}

export function CannotViewProjectErrorToTRPC(err: CannotViewProjectError): TRPCError {
  return createForbiddenError(err);
}

export function CannotAccessProjectErrorToTRPC(err: CannotAccessProjectError): TRPCError {
  return createForbiddenError(err);
}