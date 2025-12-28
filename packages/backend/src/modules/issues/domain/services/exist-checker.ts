import type { UnexpectedDatabaseError } from "@backend/libs/error";
import type { Result } from "@backend/libs/result";
import type { WorkspaceId } from "../value-objects/workspace-id";

export interface ExistChecker<Vo extends string> {
	exists(issueId: Vo, workspaceId: WorkspaceId): Promise<Result<boolean, UnexpectedDatabaseError>>
}
