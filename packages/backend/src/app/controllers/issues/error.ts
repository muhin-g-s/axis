import { isNotDomainSpecificError } from "@backend/libs/error";
import {
  notDomainErrorToTRPC,
  createBadRequestError,
  createNotFoundError,
  createForbiddenError,
} from "@backend/libs/trpc";
import {
  isIssueNotFoundError,
  isInvalidIssueTitleError,
  isInvalidIssueDescriptionError,
  isProjectNotFoundError,
  isStatusNotFoundError,
  isPriorityNotFoundError,
  isAssigneeNotFoundError,
  isUserNotWorkspaceMemberError,
  isLabelNotFoundError,
  isCannotModifyDeletedIssueError,
  type IssueDomainError,
  type IssueNotFoundError,
  type InvalidIssueTitleError,
  type InvalidIssueDescriptionError,
  type ProjectNotFoundError,
  type StatusNotFoundError,
  type PriorityNotFoundError,
  type AssigneeNotFoundError,
  type UserNotWorkspaceMemberError,
  type LabelNotFoundError,
  type CannotModifyDeletedIssueError,
	type UniqueIdentifierError,
	isUniqueIdentifierError,
} from "@backend/modules/issues/domain/errors";
import type { TRPCError } from "@trpc/server";
import { match } from "ts-pattern";

export function mapErr(err: IssueDomainError): TRPCError {
  return match(err)
    .when(isIssueNotFoundError, IssueNotFoundErrorToTRPC)
    .when(isInvalidIssueTitleError, InvalidIssueTitleErrorToTRPC)
    .when(isInvalidIssueDescriptionError, InvalidIssueDescriptionErrorToTRPC)
    .when(isProjectNotFoundError, ProjectNotFoundErrorToTRPC)
    .when(isStatusNotFoundError, StatusNotFoundErrorToTRPC)
    .when(isPriorityNotFoundError, PriorityNotFoundErrorToTRPC)
    .when(isAssigneeNotFoundError, AssigneeNotFoundErrorToTRPC)
    .when(isUserNotWorkspaceMemberError, UserNotWorkspaceMemberErrorToTRPC)
    .when(isLabelNotFoundError, LabelNotFoundErrorToTRPC)
    .when(isCannotModifyDeletedIssueError, CannotModifyDeletedIssueErrorToTRPC)
    .when(isNotDomainSpecificError, notDomainErrorToTRPC)
		.when(isUniqueIdentifierError, UniqueIdentifierErrorToTRPC)
    .exhaustive();
}

export function IssueNotFoundErrorToTRPC(err: IssueNotFoundError): TRPCError {
  return createNotFoundError(err);
}

export function InvalidIssueTitleErrorToTRPC(err: InvalidIssueTitleError): TRPCError {
  return createBadRequestError(err);
}

export function InvalidIssueDescriptionErrorToTRPC(
  err: InvalidIssueDescriptionError
): TRPCError {
  return createBadRequestError(err);
}

export function ProjectNotFoundErrorToTRPC(err: ProjectNotFoundError): TRPCError {
  return createNotFoundError(err);
}

export function StatusNotFoundErrorToTRPC(err: StatusNotFoundError): TRPCError {
  return createNotFoundError(err);
}

export function PriorityNotFoundErrorToTRPC(err: PriorityNotFoundError): TRPCError {
  return createNotFoundError(err);
}

export function AssigneeNotFoundErrorToTRPC(err: AssigneeNotFoundError): TRPCError {
  return createNotFoundError(err);
}

export function UserNotWorkspaceMemberErrorToTRPC(
  err: UserNotWorkspaceMemberError
): TRPCError {
  return createForbiddenError(err);
}

export function LabelNotFoundErrorToTRPC(err: LabelNotFoundError): TRPCError {
  return createNotFoundError(err);
}

export function CannotModifyDeletedIssueErrorToTRPC(
  err: CannotModifyDeletedIssueError
): TRPCError {
  return createBadRequestError(err);
}

function UniqueIdentifierErrorToTRPC(err: UniqueIdentifierError): TRPCError {
	return createBadRequestError(err);
}
