import type { Result } from "@backend/libs/result";
import type { Priority } from "../../domain/entities/priority";
import type { GetPrioritiesByWorkspaceQuery } from "../dto";
import {
  type WorkspaceConfigurationDomainError
} from "../../domain/errors";
import type { IPriorityRepository } from "../../domain/repositories/priority";
import type { IWorkspaceConfigurationPermissionChecker } from "../../domain/services/workspace-configuration-permission-checker";

export class GetPrioritiesByWorkspaceHandler {
  constructor(
    private readonly readRepo: IPriorityRepository,
    private readonly permissionChecker: IWorkspaceConfigurationPermissionChecker,
  ) {}

  async handle({ actorUserId, workspaceId }: GetPrioritiesByWorkspaceQuery): Promise<Result<Priority[], WorkspaceConfigurationDomainError>> {
    const canViewResult = await this.permissionChecker.canView(actorUserId, workspaceId);
    if (!canViewResult.ok) {
      return canViewResult;
    }

    const priorities = await this.readRepo.findByWorkspaceId(workspaceId);

    return priorities;
  }
}
