import type { Result } from '@backend/libs/result';
import type { Status } from '../entities/status';
import type { StatusId } from '../value-objects/status-id';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { WorkspaceConfigurationDomainError } from '../errors';

export interface IStatusRepository {
  create(
    status: Status
  ): Promise<Result<void, WorkspaceConfigurationDomainError>>;

  findById(
    id: StatusId
  ): Promise<Result<Status, WorkspaceConfigurationDomainError>>;

  findByWorkspaceId(
    workspaceId: WorkspaceId
  ): Promise<Result<Status[], WorkspaceConfigurationDomainError>>;
}
