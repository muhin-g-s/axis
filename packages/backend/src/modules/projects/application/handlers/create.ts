import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import { type Project, createProject } from "../../domain/entities";
import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { CreateProjectCommand } from "../dto";
import {
	type ProjectDomainError
} from "../../domain/errors";
import { createProjectId } from "../../domain/value-objects/id";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class CreateProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
    private readonly now: () => Timestamp,
  ) {}

  async handle({actorUserId, workspaceId, name}: CreateProjectCommand): Promise<Result<Project, ProjectDomainError>> {
		const canCreateProjectResult = await this.projectPermissionChecker.canCreateProject(actorUserId, workspaceId);
		if (!canCreateProjectResult.ok) {
			return canCreateProjectResult
		}

    const project = createProject(
      createProjectId(),
      name,
      workspaceId,
      this.now(),
    );

    const saveResult = await this.writeRepo.save(project, project.version);

    if (!saveResult.ok) {
      return Result.err(saveResult.error);
    }

    return Result.ok(project);
  }
}
