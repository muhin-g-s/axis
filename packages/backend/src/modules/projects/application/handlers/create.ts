import { Result } from "@backend/libs/result";
import type { Timestamp } from "@backend/libs/primitives";
import { type Project, createProject } from "../../domain/entities";
import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { CreateProjectCommand } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";

export class CreateProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
    private readonly now: () => Timestamp,
  ) {}

  async handle(command: CreateProjectCommand): Promise<Result<Project, ProjectDomainError>> {
    const project = createProject(
      command.id,
      command.name,
      command.workspaceId,
      this.now(),
    );

    const saveResult = await this.writeRepo.save(project, project.version);

    if (!saveResult.ok) {
      return Result.err(saveResult.error);
    }

    return Result.ok(project);
  }
}
