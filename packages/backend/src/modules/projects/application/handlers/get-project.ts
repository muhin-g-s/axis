import { type Result } from "@backend/libs/result";
import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectQuery } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";

export class GetProjectHandler {
  constructor(private readonly readRepo: ProjectReadRepository) {}

  async handle(query: GetProjectQuery): Promise<Result<Project | null, ProjectDomainError>> {
    return this.readRepo.findById(query.id);
  }
}
