import { type Result } from "@backend/libs/result";
import type { ProjectWriteRepository } from "../../domain/repositories/write";
import type { DeleteProjectCommand } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";

export class DeleteProjectHandler {
  constructor(
    private readonly writeRepo: ProjectWriteRepository,
  ) {}

  async handle(command: DeleteProjectCommand): Promise<Result<void, ProjectDomainError>> {
    return this.writeRepo.delete(command.id);
  }
}
