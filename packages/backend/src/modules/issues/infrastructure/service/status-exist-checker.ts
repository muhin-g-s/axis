import type { DbClient } from "@backend/app/db/connector";
import { workspaceStatuses } from "@backend/app/db/schema";
import { type UnexpectedDatabaseError, createUnexpectedDatabaseError } from "@backend/libs/error";
import { Result } from "@backend/libs/result";
import { and, eq } from "drizzle-orm";
import type { ExistChecker } from "../../domain/services/exist-checker";
import type { StatusId } from "../../domain/value-objects/status-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";


export class StatusExistChecker implements ExistChecker<StatusId> {
  constructor(private readonly db: DbClient) {}

  async exists(
    statusId: StatusId,
    workspaceId: WorkspaceId
  ): Promise<Result<boolean, UnexpectedDatabaseError>> {
    try {
      const result = await this.db
        .select({ id: workspaceStatuses.id })
        .from(workspaceStatuses)
        .where(
          and(
            eq(workspaceStatuses.id, statusId),
            eq(workspaceStatuses.workspaceId, workspaceId)
          )
        )
        .limit(1);

      return Result.ok(result.length > 0);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
