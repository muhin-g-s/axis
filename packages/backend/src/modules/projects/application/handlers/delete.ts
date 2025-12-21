import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { DeleteProjectCommand } from "../dto";

export class DeleteProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
  ) {}

  async handle(command: DeleteProjectCommand): Promise<void> {
    await this.writeRepo.delete(command.id);
  }
}
