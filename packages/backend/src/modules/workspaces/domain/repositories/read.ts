import { type Result } from '@backend/libs/result';
import type { Workspace } from '../entities/workspace';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { UserId } from '@backend/modules/identity/domain/value-objects/user-id';
import type { WorkspaceDomainError } from '../errors';
import type { WorkspaceUser } from '../entities/workspace-user';

export interface WorkspaceReadRepository {
  findById(id: WorkspaceId): Promise<Result<Workspace, WorkspaceDomainError>>;
  findWorkspaceUsersByUserId(userId: UserId): Promise<Result<WorkspaceUser[], WorkspaceDomainError>>;
  findWorkspaceUsersByWorkspaceId(workspaceId: WorkspaceId): Promise<Result<WorkspaceUser[], WorkspaceDomainError>>;
}