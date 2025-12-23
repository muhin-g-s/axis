import type { UserRole } from "../../domain/value-objects/role";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";
import type { WorkspaceName } from "../../domain/value-objects/workspace-name";

export interface CreateWorkspaceCommand {
  readonly userId: UserId;
  readonly name: WorkspaceName;
}

export interface GetUserWorkspacesQuery {
  readonly userId: UserId;
}

export interface UserWorkspace {
  readonly workspaceId: WorkspaceId;
  readonly name: WorkspaceName;
  readonly role: UserRole;
}
