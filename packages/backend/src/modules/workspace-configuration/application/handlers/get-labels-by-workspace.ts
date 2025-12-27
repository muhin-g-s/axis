import { type Result } from "@backend/libs/result";
import type { Label } from "../../domain/entities/label";
import {
  type WorkspaceConfigurationDomainError
} from "../../domain/errors";
import type { ILabelRepository } from "../../domain/repositories/label";
import type { IWorkspaceConfigurationPermissionChecker } from "../../domain/services/workspace-configuration-permission-checker";
import type { GetLabelsByWorkspaceQuery } from "../dto";

export class GetLabelsByWorkspaceHandler {
  constructor(
    private readonly readRepo: ILabelRepository,
    private readonly permissionChecker: IWorkspaceConfigurationPermissionChecker,
  ) {}

  async handle({ actorUserId, workspaceId }: GetLabelsByWorkspaceQuery): Promise<Result<Label[], WorkspaceConfigurationDomainError>> {
    const canViewResult = await this.permissionChecker.canView(actorUserId, workspaceId);
    if (!canViewResult.ok) {
      return canViewResult;
    }

    const labels = await this.readRepo.findByWorkspaceId(workspaceId);

    return labels;
  }
}
