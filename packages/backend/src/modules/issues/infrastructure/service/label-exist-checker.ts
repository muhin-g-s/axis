import { eq, and } from 'drizzle-orm';
import type { DbClient } from '@backend/app/db/connector';
import type { ExistChecker } from '../../domain/services/exist-checker';
import type { LabelId } from '../../domain/value-objects/label-id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import { Result } from '@backend/libs/result';
import { workspaceLabels } from '@backend/app/db/schema/tables/workspace-labels';
import { createUnexpectedDatabaseError, type UnexpectedDatabaseError } from '@backend/libs/error';

export class LabelExistChecker implements ExistChecker<LabelId> {
  constructor(private readonly db: DbClient) {}

  async exists(
    labelId: LabelId,
    workspaceId: WorkspaceId
  ): Promise<Result<boolean, UnexpectedDatabaseError>> {
    try {
      const result = await this.db
        .select({ id: workspaceLabels.id })
        .from(workspaceLabels)
        .where(
          and(
            eq(workspaceLabels.id, labelId),
            eq(workspaceLabels.workspaceId, workspaceId)
          )
        )
        .limit(1);

      return Result.ok(result.length > 0);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
