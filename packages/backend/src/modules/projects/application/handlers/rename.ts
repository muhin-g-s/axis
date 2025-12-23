import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { UnitOfWork } from "../../domain/repositories/unit-of-work";
import type { RenameProjectCommand } from "../dto";
import { rename } from "../../domain/entities";
import { createCannotModifyDeletedProjectError } from "../../domain/errors";
import type { ProjectDomainError } from "../../domain/errors";
import type { IProjectPermissionChecker } from "../../domain/services/project-permission-checker";

export class RenameProjectHandler {
  constructor(
    private readonly readRepo: ProjectReadRepository,
    private readonly uow: UnitOfWork,
		private readonly projectPermissionChecker: IProjectPermissionChecker,
    private readonly now: () => Timestamp,
  ) {}

  async handle({actorUserId, workspaceId, id, newName}: RenameProjectCommand): Promise<Result<void, ProjectDomainError>> {
		const canDeleteProjectResult = await this.projectPermissionChecker.canViewProject(actorUserId, workspaceId);
		if (!canDeleteProjectResult.ok) {
			return canDeleteProjectResult
		}

    const result = await this.uow.run(async (uow) => {
      const findResult = await this.readRepo.findById(id);
      if (!findResult.ok) {
        return Result.err(findResult.error);
      }

      const project = findResult.value;

			if (project.deletedAt !== undefined) {
				return Result.err(createCannotModifyDeletedProjectError(id));
			}

      const updatedProject = rename(project, newName, this.now());

      const saveResult = await uow.projects.save(updatedProject, project.version);
      if (!saveResult.ok) {
        return Result.err(saveResult.error);
      }

      return Result.ok(undefined);
    });

    return result;
  }
}
