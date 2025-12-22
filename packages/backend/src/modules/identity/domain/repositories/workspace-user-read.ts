import type { Result } from '@backend/libs/result';
import type { WorkspaceUser } from '../entities/workspace-user';
import type { UserId } from '../value-objects/user-id';
import type { WorkspaceId } from '../value-objects/workspace-id';
import type { IdentityDomainError } from '../errors';

export interface WorkspaceUserReadRepository {
  findByUserIdAndWorkspaceId(userId: UserId, workspaceId: WorkspaceId): Promise<Result<WorkspaceUser, IdentityDomainError>>;
}
