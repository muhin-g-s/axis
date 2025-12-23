import { type Result } from "@backend/libs/result";
import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectsByWorkspaceQuery } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class GetProjectsByWorkspaceHandler {
  constructor(
		private readonly readRepo: ProjectReadRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
	) {}

  async handle({actorUserId, workspaceId}: GetProjectsByWorkspaceQuery): Promise<Result<Project[], ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canViewProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    return this.readRepo.findAllByWorkspace(workspaceId);
  }
}
