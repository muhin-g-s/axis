import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectsByWorkspaceQuery } from "../dto";

export class GetProjectsByWorkspaceHandler {
  constructor(private readonly readRepo: ProjectReadRepository) {}

  async handle(query: GetProjectsByWorkspaceQuery): Promise<Project[]> {
    return this.readRepo.findAllByWorkspace(query.id);
  }
}
