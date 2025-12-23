import type { Result } from "@backend/libs/result";
import type { UserId } from "../value-objects/user-id";
import type { WorkspaceId } from "../value-objects/workspace-id";
import type { WorkspaceConfigurationDomainError } from "../errors";

export interface IWorkspaceConfigurationPermissionChecker {
  canCreate(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, WorkspaceConfigurationDomainError>>;
  canModify(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, WorkspaceConfigurationDomainError>>;
  canView(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, WorkspaceConfigurationDomainError>>;
}
