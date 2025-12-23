import { type Result } from "@backend/libs/result";
import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectQuery } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class GetProjectHandler {
  constructor(
		private readonly readRepo: ProjectReadRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
	) {}

  async handle({actorUserId, workspaceId, id}: GetProjectQuery): Promise<Result<Project | null, ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canViewProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    return this.readRepo.findById(id);
  }
}
