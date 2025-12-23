import type { Result } from "@backend/libs/result";
import type { UserId } from "../value-objects/user-id";
import type { WorkspaceId } from "../value-objects/workspace-id";
import type { ProjectDomainError } from "../errors";

export interface IProjectPermissionChecker {
  canCreateProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
	canDeleteProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
	canModifyProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
	canViewProject(userId: UserId, workspaceId: WorkspaceId): Promise<Result<void, ProjectDomainError>>;
}
