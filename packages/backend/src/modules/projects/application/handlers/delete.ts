import { type Result } from "@backend/libs/result";
import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { DeleteProjectCommand } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class DeleteProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
  ) {}

  async handle({actorUserId, id, workspaceId}: DeleteProjectCommand): Promise<Result<void, ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canDeleteProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    return this.writeRepo.delete(id);
  }
}
