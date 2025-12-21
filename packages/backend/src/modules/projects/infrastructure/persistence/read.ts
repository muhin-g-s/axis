import { eq } from 'drizzle-orm';
import type { DbClient } from '@backend/app/db/connector';
import { projects } from '@backend/app/db/schema';

import { ProjectSchema, type Project } from '../../domain/entities';
import type { ProjectId } from '../../domain/value-objects/id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { ProjectReadRepository } from '../../domain/repositories/read';

export class DrizzleProjectReadRepository
  implements ProjectReadRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async findById(id: ProjectId): Promise<Project | null> {
    const result = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

		const [project] = result;

		if (project == undefined) {
			// TODO: throw error
			return null;
		}

		// TODO: throw error
		return ProjectSchema.assert(project);
  }

  async findAllByWorkspace(
    workspaceId: WorkspaceId
  ): Promise<Project[]> {
    const res = await this.db
      .select()
      .from(projects)
      .where(
        eq(projects.workspaceId, workspaceId)
      );

		// TODO: throw error
		return res.map(ProjectSchema.assert);
  }
}
