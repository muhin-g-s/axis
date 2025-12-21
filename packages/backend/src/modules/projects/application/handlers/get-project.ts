import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectQuery } from "../dto";

export class GetProjectHandler {
  constructor(private readonly readRepo: ProjectReadRepository) {}

  async handle(query: GetProjectQuery): Promise<Project | null> {
    return this.readRepo.findById(query.id);
  }
}
