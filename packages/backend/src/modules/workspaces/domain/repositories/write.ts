import type { Result } from '@backend/libs/result';
import type { Workspace } from '../entities/workspace';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { WorkspaceUser } from '../entities/workspace-user';
import type { WorkspaceDomainError } from '../errors';

export interface WorkspaceWriteRepository {
  saveWorkspace(workspace: Workspace): Promise<Result<void, WorkspaceDomainError>>;
  saveWorkspaceUser(workspaceUser: WorkspaceUser): Promise<Result<void, WorkspaceDomainError>>;
  deleteWorkspace(id: WorkspaceId): Promise<Result<void, WorkspaceDomainError>>;
}
