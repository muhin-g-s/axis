import type { Result } from '@backend/libs/result';
import type { WorkspaceUser } from '../entities/workspace-user';
import type { IdentityDomainError } from '../errors';

export interface WorkspaceUserWriteRepository {
  save(workspaceUser: WorkspaceUser): Promise<Result<void, IdentityDomainError>>;
}
