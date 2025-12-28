import type { DomainError } from "@backend/libs/error";

export interface BaseIssueError {
  type: string;
  message: string;
}

export interface InvalidIssueTitleError extends BaseIssueError {
  type: "INVALID_ISSUE_TITLE";
  value: string;
}

export interface InvalidIssueDescriptionError extends BaseIssueError {
  type: "INVALID_ISSUE_DESCRIPTION";
  value: string;
}

export interface IssueNotFoundError extends BaseIssueError {
  type: "ISSUE_NOT_FOUND";
  id: string;
}

export interface ProjectNotFoundError extends BaseIssueError {
  type: "PROJECT_NOT_FOUND";
  id: string;
}

export interface StatusNotFoundError extends BaseIssueError {
  type: "STATUS_NOT_FOUND";
  id: string;
}

export interface PriorityNotFoundError extends BaseIssueError {
  type: "PRIORITY_NOT_FOUND";
  id: string;
}

export interface AssigneeNotFoundError extends BaseIssueError {
  type: "ASSIGNEE_NOT_FOUND";
  id: string;
}

export interface UserNotWorkspaceMemberError extends BaseIssueError {
  type: "USER_NOT_WORKSPACE_MEMBER";
  userId: string;
  workspaceId: string;
}

export interface LabelNotFoundError extends BaseIssueError {
  type: "LABEL_NOT_FOUND";
  id: string;
}

export interface UniqueIdentifierError extends BaseIssueError {
  type: "UNIQUE_IDENTIFIER_ERROR";
  value: string;
}

export interface CannotModifyDeletedIssueError extends BaseIssueError {
  type: "CANNOT_MODIFY_DELETED_ISSUE";
  issueId: string;
}

export type IssueDomainError = DomainError<
  | InvalidIssueTitleError
  | InvalidIssueDescriptionError
  | IssueNotFoundError
  | ProjectNotFoundError
  | StatusNotFoundError
  | PriorityNotFoundError
  | AssigneeNotFoundError
  | UserNotWorkspaceMemberError
  | LabelNotFoundError
  | UniqueIdentifierError
  | CannotModifyDeletedIssueError
>;

export const createInvalidIssueTitleError = (value: string): InvalidIssueTitleError => ({
  type: "INVALID_ISSUE_TITLE",
  message: `Invalid issue title: ${value}`,
  value,
});

export const createInvalidIssueDescriptionError = (value: string): InvalidIssueDescriptionError => ({
  type: "INVALID_ISSUE_DESCRIPTION",
  message: `Invalid issue description: ${value}`,
  value,
});

export const createIssueNotFoundError = (id: string): IssueNotFoundError => ({
  type: "ISSUE_NOT_FOUND",
  message: `Issue with id ${id} not found`,
  id,
});

export const createProjectNotFoundError = (id: string): ProjectNotFoundError => ({
  type: "PROJECT_NOT_FOUND",
  message: `Project with id ${id} not found`,
  id,
});

export const createStatusNotFoundError = (id: string): StatusNotFoundError => ({
  type: "STATUS_NOT_FOUND",
  message: `Status with id ${id} not found`,
  id,
});

export const createPriorityNotFoundError = (id: string): PriorityNotFoundError => ({
  type: "PRIORITY_NOT_FOUND",
  message: `Priority with id ${id} not found`,
  id,
});

export const createAssigneeNotFoundError = (id: string): AssigneeNotFoundError => ({
  type: "ASSIGNEE_NOT_FOUND",
  message: `Assignee with id ${id} not found`,
  id,
});

export const createUserNotWorkspaceMemberError = (
  userId: string,
  workspaceId: string
): UserNotWorkspaceMemberError => ({
  type: "USER_NOT_WORKSPACE_MEMBER",
  message: `User with id ${userId} is not a member of workspace ${workspaceId}`,
  userId,
  workspaceId,
});

export const createLabelNotFoundError = (id: string): LabelNotFoundError => ({
  type: "LABEL_NOT_FOUND",
  message: `Label with id ${id} not found`,
  id,
});

export const createCannotModifyDeletedIssueError = (
  issueId: string
): CannotModifyDeletedIssueError => ({
  type: "CANNOT_MODIFY_DELETED_ISSUE",
  message: `Cannot modify deleted issue ${issueId}`,
  issueId,
});

export const isInvalidIssueTitleError = (
  error: IssueDomainError
): error is InvalidIssueTitleError =>
  error.type === "INVALID_ISSUE_TITLE";

export const isInvalidIssueDescriptionError = (
  error: IssueDomainError
): error is InvalidIssueDescriptionError =>
  error.type === "INVALID_ISSUE_DESCRIPTION";

export const isIssueNotFoundError = (
  error: IssueDomainError
): error is IssueNotFoundError =>
  error.type === "ISSUE_NOT_FOUND";

export const isProjectNotFoundError = (
  error: IssueDomainError
): error is ProjectNotFoundError =>
  error.type === "PROJECT_NOT_FOUND";

export const isStatusNotFoundError = (
  error: IssueDomainError
): error is StatusNotFoundError =>
  error.type === "STATUS_NOT_FOUND";

export const isPriorityNotFoundError = (
  error: IssueDomainError
): error is PriorityNotFoundError =>
  error.type === "PRIORITY_NOT_FOUND";

export const isAssigneeNotFoundError = (
  error: IssueDomainError
): error is AssigneeNotFoundError =>
  error.type === "ASSIGNEE_NOT_FOUND";

export const isUserNotWorkspaceMemberError = (
  error: IssueDomainError
): error is UserNotWorkspaceMemberError =>
  error.type === "USER_NOT_WORKSPACE_MEMBER";

export const isLabelNotFoundError = (
  error: IssueDomainError
): error is LabelNotFoundError =>
  error.type === "LABEL_NOT_FOUND";

export const isUniqueIdentifierError = (
  error: IssueDomainError
): error is UniqueIdentifierError =>
  error.type === "UNIQUE_IDENTIFIER_ERROR";

export const isCannotModifyDeletedIssueError = (
  error: IssueDomainError
): error is CannotModifyDeletedIssueError =>
  error.type === "CANNOT_MODIFY_DELETED_ISSUE";
