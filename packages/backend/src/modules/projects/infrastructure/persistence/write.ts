import { and, eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { projects } from '@backend/app/db/schema';

import type { Project } from '../../domain/entities';
import type { ProjectId } from '../../domain/value-objects/id';
import type { ProjectWriteRepository } from '../../domain/repositories/write';
import type { Version } from '@backend/libs/primitives';
import { createOptimisticLockError, createUnexpectedDatabaseError, type ProjectDomainError } from '../../domain/errors';

export class DrizzleProjectWriteRepository
  implements ProjectWriteRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async save(project: Project, expectedVersion: Version): Promise<Result<void, ProjectDomainError>> {
		try{
			const result = await this.db
      .update(projects)
      .set({
        name: project.name,
        workspaceId: project.workspaceId,
        updatedAt: project.updatedAt,
        deletedAt: project.deletedAt ?? null,
        version: project.version,
      })
      .where(
        and(
          eq(projects.id, project.id),
          eq(projects.version, expectedVersion)
        )
      );

    if (result.changes === 0) {
      return Result.err(createOptimisticLockError(project.id));
    }

    return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
  }

  async delete(id: ProjectId): Promise<Result<void, ProjectDomainError>> {
		try{
			// TODO: add soft delete
			await this.db
				.delete(projects)
				.where(eq(projects.id, id));

			return Result.ok(undefined);
		} catch (error) {
			return Result.err(createUnexpectedDatabaseError(error));
		}
  }
}
