import { eq } from 'drizzle-orm';
import { Result } from '@backend/libs/result';
import type { DbClient } from '@backend/app/db/connector';
import { projects } from '@backend/app/db/schema';

import { ProjectSchema, type Project } from '../../domain/entities';
import type { ProjectId } from '../../domain/value-objects/id';
import type { WorkspaceId } from '../../domain/value-objects/workspace-id';
import type { ProjectReadRepository } from '../../domain/repositories/read';
import {
	createInvalidObjectInDatabaseError,
	createProjectNotFoundError,
	type ProjectDomainError,
	type InvalidObjectInDatabaseError,
	createUnexpectedDatabaseError
} from '../../domain/errors';
import { validate } from '@backend/libs/validation';

export class DrizzleProjectReadRepository
  implements ProjectReadRepository {

  constructor(
    private readonly db: DbClient
  ) {}

  async findById(id: ProjectId): Promise<Result<Project, ProjectDomainError>> {
    try {
      const result = await this.db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      const [project] = result;

      if (project == undefined) {
        return Result.err(createProjectNotFoundError(id));
      }

      const validatedProject = validate<Project, InvalidObjectInDatabaseError>(
				ProjectSchema,
				project,
				msg => createInvalidObjectInDatabaseError(project, 'ProjectSchema', msg)
			);

			return validatedProject;
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }

  async findAllByWorkspace(
    workspaceId: WorkspaceId
  ): Promise<Result<Project[], ProjectDomainError>> {
    try {
      const res = await this.db
        .select()
        .from(projects)
        .where(eq(projects.workspaceId, workspaceId));

			for (const project of res) {
				const validatedProject = validate<Project, InvalidObjectInDatabaseError>(
					ProjectSchema,
					project,
					msg => createInvalidObjectInDatabaseError(project, 'ProjectSchema', msg)
				);

				if (!validatedProject.ok) {
					return Result.err(validatedProject.error);
				}
			}

      return Result.ok(res as Project[]);
    } catch (error) {
      return Result.err(createUnexpectedDatabaseError(error));
    }
  }
}
