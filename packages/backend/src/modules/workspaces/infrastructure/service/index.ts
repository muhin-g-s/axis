import { and, eq, sql } from "drizzle-orm";
import type { DbClient } from "@backend/app/db/connector";
import { workspaceUsers } from "@backend/app/db/schema";
import type { UserId } from "../../domain/value-objects/user-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";
import type { WorkspaceMembershipChecker } from "../../domain/ports";
import { Result } from "@backend/libs/result";

export class DrizzleWorkspaceMembershipChecker
  implements WorkspaceMembershipChecker
{
  constructor(private readonly db: DbClient) {}

  async isMember(userId: UserId, workspaceId: WorkspaceId): Promise<Result<boolean, unknown>> {
		try {
			 const result = await this.db
      .select({ exists: sql<number>`1` })
      .from(workspaceUsers)
      .where(
        and(
          eq(workspaceUsers.userId, userId),
          eq(workspaceUsers.workspaceId, workspaceId),
        )
      )
      .limit(1);

    return Result.ok(result.length > 0);
		} catch (error) {
			return Result.err(error);
		}
  }
}
