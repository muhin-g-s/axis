import type { Result } from '@backend/libs/result';
import type { Priority } from '../entities/priority';
import type { PriorityId } from '../value-objects/priority-id';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { WorkspaceConfigurationDomainError } from '../errors';

export interface IPriorityRepository {
  create(
    priority: Priority
  ): Promise<Result<void, WorkspaceConfigurationDomainError>>;

  findById(
    id: PriorityId
  ): Promise<Result<Priority, WorkspaceConfigurationDomainError>>;

  findByWorkspaceId(
    workspaceId: WorkspaceId
  ): Promise<Result<Priority[], WorkspaceConfigurationDomainError>>;
}
