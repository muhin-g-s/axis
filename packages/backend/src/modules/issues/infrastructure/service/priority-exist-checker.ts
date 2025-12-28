import type { DbClient } from "@backend/app/db/connector";
import { workspacePriorities } from "@backend/app/db/schema";
import { type UnexpectedDatabaseError, createUnexpectedDatabaseError } from "@backend/libs/error";
import { Result } from "@backend/libs/result";
import { and, eq } from "drizzle-orm";
import type { ExistChecker } from "../../domain/services/exist-checker";
import type { PriorityId } from "../../domain/value-objects/priority-id";
import type { WorkspaceId } from "../../domain/value-objects/workspace-id";


export class PriorityExistChecker implements ExistChecker<PriorityId> {
  constructor(private readonly db: DbClient) {}

  async exists(
    priorityId: PriorityId,
    workspaceId: WorkspaceId
  ): Promise<Result<boolean, UnexpectedDatabaseError>> {
    try {
      const result = await this.db
        .select({ id: workspacePriorities.id })
        .from(workspacePriorities)
        .where(
          and(
            eq(workspacePriorities.id, priorityId),
            eq(workspacePriorities.workspaceId, workspaceId)
          )
        )
        .limit(1);

      return Result.ok(result.length > 0);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
