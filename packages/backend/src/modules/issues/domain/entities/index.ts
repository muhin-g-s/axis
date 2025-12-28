import { type } from 'arktype';
import { TimestampSchema, type Timestamp } from '@backend/libs/primitives';
import { IssueIdSchema, type IssueId } from '../value-objects/id';
import { IssueTitleSchema, type IssueTitle } from '../value-objects/title';
import { IssueDescriptionSchema, type IssueDescription } from '../value-objects/description';
import { ProjectIdSchema, type ProjectId } from '../value-objects/project-id';
import { StatusIdSchema, type StatusId } from '../value-objects/status-id';
import { PriorityIdSchema, type PriorityId } from '../value-objects/priority-id';
import { UserIdSchema, type UserId } from '../value-objects/user-id';
import { UniqueIdentifierSchema, type UniqueIdentifier } from '../value-objects/unique-identifier';
import { LabelIdSchema, type LabelId } from '../value-objects/label-id';

export const IssueSchema = type({
  id: IssueIdSchema,
  projectId: ProjectIdSchema,
  title: IssueTitleSchema,
  label: LabelIdSchema.optional(),
  description: IssueDescriptionSchema,
  statusId: StatusIdSchema.optional(),
  priorityId: PriorityIdSchema.optional(),
  assigneeId: UserIdSchema.optional(),
  uniqueIdentifier: UniqueIdentifierSchema,
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
  deletedAt: TimestampSchema.optional(),
});

export type Issue = typeof IssueSchema.infer;

export function createIssue(
  id: IssueId,
  projectId: ProjectId,
  title: IssueTitle,
  description: IssueDescription,
  uniqueIdentifier: UniqueIdentifier,
  now: Timestamp,
  statusId?: StatusId,
  priorityId?: PriorityId,
  assigneeId?: UserId,
): Issue {
  return {
    id,
    projectId,
    title,
    description,
    ...(statusId !== undefined && { statusId }),
    ...(priorityId !== undefined && { priorityId }),
    ...(assigneeId !== undefined && { assigneeId }),
    uniqueIdentifier,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateIssueStatus(
  issue: Issue,
  statusId: StatusId,
  now: Timestamp
): Issue {
  if (issue.statusId === statusId) {
    return issue;
  }

  return { ...issue, statusId, updatedAt: now };
}

export function updateIssuePriority(
  issue: Issue,
  priorityId: PriorityId,
  now: Timestamp
): Issue {
  if (issue.priorityId === priorityId) {
    return issue;
  }

  return { ...issue, priorityId, updatedAt: now };
}

export function assignIssueToUser(
  issue: Issue,
  assigneeId: UserId | undefined,
  now: Timestamp
): Issue {
  if (issue.assigneeId === assigneeId) {
    return issue;
  }

  if (assigneeId === undefined) {
    const { assigneeId: _, ...rest } = issue;

    return {
      ...rest,
      updatedAt: now,
    };
  }

  return {
    ...issue,
    assigneeId,
    updatedAt: now,
  };
}

export function deleteIssue(issue: Issue, now: Timestamp): Issue {
  return { ...issue, deletedAt: now };
}

export function isDeleted(issue: Issue): boolean {
	return issue.deletedAt !== undefined;
}

export function addLabelToIssue(issue: Issue, labelId: LabelId, now: Timestamp): Issue {
	return { ...issue, label: labelId, updatedAt: now };
}
