import type { Result } from '@backend/libs/result';
import type { Issue } from '../entities';
import type { IssueId } from '../value-objects/id';
import type { IssueDomainError } from '../errors';
import type { LabelId } from '../value-objects/label-id';
import type { PriorityId } from '../value-objects/priority-id';
import type { StatusId } from '../value-objects/status-id';
import type { ProjectId } from '../value-objects/project-id';

export interface IssueWriteRepository {
  save(issue: Issue): Promise<Result<void, IssueDomainError>>;

  delete(id: IssueId): Promise<Result<void, IssueDomainError>>;
}

export interface IssueReadRepository {
  findById(id: IssueId): Promise<Result<Issue, IssueDomainError>>;

  findByProjectId(projectId: ProjectId): Promise<Result<Issue[], IssueDomainError>>;

  findByProjectWithFilters(
    projectId: ProjectId,
    statusId?: StatusId,
    priorityId?: PriorityId,
    labelIds?: LabelId[]
  ): Promise<Result<Issue[], IssueDomainError>>;

	findLastAddedIssue(projectId: ProjectId): Promise<Result<Issue, IssueDomainError>>
}

export interface IssueUnitOfWork {
  issues: IssueWriteRepository;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  run<T>(fn: (uow: this) => Promise<Result<T, IssueDomainError>>): Promise<Result<T, IssueDomainError>>;
}
