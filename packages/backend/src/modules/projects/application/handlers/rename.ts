import type { Timestamp } from "@backend/libs/primitives";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { UnitOfWork } from "../../domain/repositories/unit-of-work";
import type { RenameProjectCommand } from "../dto";
import { rename } from "../../domain/entities";

export class RenameProjectHandler {
  constructor(
    private readonly readRepo: ProjectReadRepository,
    private readonly uow: UnitOfWork,
    private readonly now: () => Timestamp,
  ) {}

	 async handle(command: RenameProjectCommand): Promise<void> {

		await this.uow.run(async (uow) => {
      const project = await this.readRepo.findById(command.id);
      if (project === null) throw new Error('Project not found');

      const updated = rename(project, command.newName, this.now());

      await uow.projects.save(updated, project.version);
    });
  }
}
