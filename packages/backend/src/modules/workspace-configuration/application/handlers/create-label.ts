import { Result } from "@backend/libs/result";
import { type Label, createLabel } from "../../domain/entities/label";
import type { CreateLabelCommand } from "../dto";
import {
  type WorkspaceConfigurationDomainError
} from "../../domain/errors";
import { createLabelId } from "../../domain/value-objects/label-id";
import type { IWorkspaceConfigurationPermissionChecker } from "../../domain/services/workspace-configuration-permission-checker";
import type { ILabelRepository } from "../../domain/repositories/label";

export class CreateLabelHandler {
  constructor(
    private readonly writeRepo: ILabelRepository,
    private readonly permissionChecker: IWorkspaceConfigurationPermissionChecker,
  ) {}

  async handle({ actorUserId, name, workspaceId }: CreateLabelCommand): Promise<Result<Label, WorkspaceConfigurationDomainError>> {
    const canCreateLabelResult = await this.permissionChecker.canCreate(actorUserId, workspaceId);
    if (!canCreateLabelResult.ok) {
      return canCreateLabelResult;
    }

    const label = createLabel(
      createLabelId(),
      workspaceId,
      name,
    );

    const saveResult = await this.writeRepo.create(label);

    if (!saveResult.ok) {
      return Result.err(saveResult.error);
    }

    return Result.ok(label);
  }
}
