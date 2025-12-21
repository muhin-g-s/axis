import { type Result } from "@backend/libs/result";
import type { Project } from "../../domain/entities";
import type { ProjectReadRepository } from "../../domain/repositories/read";
import type { GetProjectsByWorkspaceQuery } from "../dto";
import type { ProjectDomainError } from "../../domain/errors";

export class GetProjectsByWorkspaceHandler {
  constructor(private readonly readRepo: ProjectReadRepository) {}

  async handle(query: GetProjectsByWorkspaceQuery): Promise<Result<Project[], ProjectDomainError>> {
    return this.readRepo.findAllByWorkspace(query.id);
  }
}
