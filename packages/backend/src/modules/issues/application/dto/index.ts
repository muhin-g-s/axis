import type { IssueId } from "../../domain/value-objects/id";
import type { IssueTitle } from "../../domain/value-objects/title";
import type { IssueDescription } from "../../domain/value-objects/description";
import type { PriorityId } from "../../domain/value-objects/priority-id";
import type { ProjectId } from "../../domain/value-objects/project-id";
import type { StatusId } from "../../domain/value-objects/status-id";
import type { UserId } from "../../domain/value-objects/user-id";
import type { LabelId } from "../../domain/value-objects/label-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";

export interface CreateIssueCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
  readonly projectId: ProjectId,
  readonly title: IssueTitle,
  readonly description: IssueDescription,
}

export interface UpdateIssueStatusCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly issueId: IssueId,
	readonly statusId: StatusId
}

export interface UpdateIssuePriorityCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly issueId: IssueId,
	readonly priorityId: PriorityId
}

export interface AddLabelToIssueCommand {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly issueId: IssueId,
	readonly labelId: LabelId
}

export interface GetProjectIssuesQuery {
	readonly actorUserId: UserId,
	readonly workspaceId: WorkspaceId,
	readonly projectId: ProjectId,
	readonly statusId?: StatusId,
	readonly priorityId?: PriorityId,
	readonly labelIds?: LabelId[]
}

export interface GetIssueQuery {
  readonly actorUserId: UserId;
  readonly workspaceId: WorkspaceId;
  readonly issueId: IssueId;
}

export interface DeleteIssueCommand {
  readonly actorUserId: UserId,
  readonly workspaceId: WorkspaceId,
  readonly issueId: IssueId,
}

export interface AssignIssueToUserCommand {
  readonly actorUserId: UserId,
  readonly workspaceId: WorkspaceId,
  readonly issueId: IssueId,
  readonly assigneeId: UserId,
}

export interface UpdateIssueCommand {
  readonly actorUserId: UserId,
  readonly workspaceId: WorkspaceId,
  readonly issueId: IssueId,
  readonly title: IssueTitle | null,
  readonly description: IssueDescription | null,
}

export interface GetLastAddedIssueQuery {
  readonly actorUserId: UserId;
  readonly workspaceId: WorkspaceId;
  readonly projectId: ProjectId;
}
