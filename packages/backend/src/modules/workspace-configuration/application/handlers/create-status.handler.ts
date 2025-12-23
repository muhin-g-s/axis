import { Result } from "@backend/libs/result";
import { type Status, createStatus } from "../../domain/entities/status";
import type { CreateStatusCommand } from "../dto";
import {
  type WorkspaceConfigurationDomainError
} from "../../domain/errors";
import { createStatusId } from "../../domain/value-objects/status-id";
import type { IStatusRepository } from "../../domain/repositories/status";
import type { IWorkspaceConfigurationPermissionChecker } from "../../domain/services/workspace-configuration-permission-checker";

export class CreateStatusHandler {
  constructor(
    private readonly writeRepo: IStatusRepository,
    private readonly permissionChecker: IWorkspaceConfigurationPermissionChecker,
  ) {}

  async handle({ actorUserId, workspaceId, name, order }: CreateStatusCommand): Promise<Result<Status, WorkspaceConfigurationDomainError>> {
    const canCreateResult = await this.permissionChecker.canCreate(actorUserId, workspaceId);
    if (!canCreateResult.ok) {
      return canCreateResult;
    }

    const status = createStatus(
      createStatusId(),
      workspaceId,
      name,
      order
    );

    const saveResult = await this.writeRepo.create(status);

    if (!saveResult.ok) {
      return Result.err(saveResult.error);
    }

    return Result.ok(status);
  }
}
