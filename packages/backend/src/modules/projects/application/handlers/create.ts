import type { Timestamp } from "@backend/libs/primitives";
import { type Project, createProject } from "../../domain/entities";
import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { CreateProjectCommand } from "../dto";

export class CreateProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
    private readonly now: () => Timestamp,
  ) {}

  async handle(command: CreateProjectCommand): Promise<Project> {
    const project = createProject(
      command.id,
      command.name,
      command.workspaceId,
      this.now(),
    );

    await this.writeRepo.save(project, project.version);

    return project;
  }
}
