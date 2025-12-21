import { and, eq } from 'drizzle-orm';
import type { DbClient } from '@backend/app/db/connector';
import { projects } from '@backend/app/db/schema';

import type { Project } from '../../domain/entities';
import type { ProjectId } from '../../domain/value-objects/id';
import type { ProjectWriteRepository } from '../../domain/repositories/write';
import type { Version } from '@backend/libs/primitives';

export class DrizzleProjectWriteRepository
  implements ProjectWriteRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async save(project: Project, expectedVersion: Version): Promise<void> {
   const result = await this.db
      .update(projects)
      .set({
        name: project.name,
        workspaceId: project.workspaceId,
        updatedAt: project.updatedAt,
        deletedAt: project.deletedAt ?? null,
        version: project.version, // новая версия из домена
      })
      .where(
        and(
          eq(projects.id, project.id),
          eq(projects.version, expectedVersion)
        )
      );

    if (result.changes === 0) {
      throw new Error('Optimistic lock error: project version mismatch');
    }
  }

  async delete(id: ProjectId): Promise<void> {
    await this.db
      .delete(projects)
      .where(eq(projects.id, id));
  }
}
