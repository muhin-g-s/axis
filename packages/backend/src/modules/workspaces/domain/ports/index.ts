import type { Result } from "@backend/libs/result";
import type { UserId } from "../value-objects/user-id";
import type { WorkspaceId } from "../value-objects/workspace-id";
import type { UnexpectedDatabaseError } from "@backend/libs/error";

export interface WorkspaceMembershipChecker {
  isMember(userId: UserId, workspaceId: WorkspaceId): Promise<Result<boolean, UnexpectedDatabaseError>>;
}
