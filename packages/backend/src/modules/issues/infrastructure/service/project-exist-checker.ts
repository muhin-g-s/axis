import { and, eq } from 'drizzle-orm';
import type { DbClient } from '@backend/app/db/connector';
import type { ExistChecker } from '../../domain/services/exist-checker';
import type { ProjectId } from '../../domain/value-objects/project-id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import { Result } from '@backend/libs/result';
import { projects } from '@backend/app/db/schema/tables/projects';
import { createUnexpectedDatabaseError, type UnexpectedDatabaseError } from '@backend/libs/error';

export class ProjectExistChecker implements ExistChecker<ProjectId> {
  constructor(private readonly db: DbClient) {}

  async exists(
    projectId: ProjectId,
    workspaceId: WorkspaceId
  ): Promise<Result<boolean, UnexpectedDatabaseError>> {
    try {
      const result =  await this.db
        .select({ id: projects.id })
        .from(projects)
        .where(
          and(
						eq(projects.id, projectId),
						eq(projects.workspaceId, workspaceId)
					)
        )
        .limit(1);

      return Result.ok(result.length > 0);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
