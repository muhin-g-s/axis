import type { Result } from "@backend/libs/result";
import type { Status } from "../../domain/entities/status";
import type { GetStatusesByWorkspaceQuery } from "../dto";
import {
  type WorkspaceConfigurationDomainError
} from "../../domain/errors";
import type { IStatusRepository } from "../../domain/repositories/status";
import type { IWorkspaceConfigurationPermissionChecker } from "../../domain/services/workspace-configuration-permission-checker";

export class GetStatusesByWorkspaceHandler {
  constructor(
    private readonly readRepo: IStatusRepository,
    private readonly permissionChecker: IWorkspaceConfigurationPermissionChecker,
  ) {}

  async handle({ actorUserId, workspaceId }: GetStatusesByWorkspaceQuery): Promise<Result<Status[], WorkspaceConfigurationDomainError>> {
    const canViewResult = await this.permissionChecker.canView(actorUserId, workspaceId);
    if (!canViewResult.ok) {
      return canViewResult;
    }

    const statuses = await this.readRepo.findByWorkspaceId(workspaceId);

    return statuses;
  }
}
